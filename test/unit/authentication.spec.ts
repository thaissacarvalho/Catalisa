import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AdminCredentialEntity } from '@app/common/authentication/domain/entities/admin-credential.entity';
import { AdminCredentialRepository } from '@app/common/authentication/domain/repositories/admin-credential.repository';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { AuthenticationService } from '@app/common/authentication/authentication.service';
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { environment } from '@app/config/environment';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { expectSyncTokenError, makeUser } from '@test/unit/factories';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

function userRepositoryMock(): jest.Mocked<UserRepository> {
  return {
    create: jest.fn(),
    existsByRole: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findByUserCode: jest.fn(),
    updateStatusByUserCode: jest.fn(),
  };
}

function credentialRepositoryMock(): jest.Mocked<AdminCredentialRepository> {
  return {
    createInitialSuperAdmin: jest.fn(),
    findByUserId: jest.fn(),
    promoteParticipantToAdmin: jest.fn(),
    updatePassword: jest.fn(),
  };
}

function jwtServiceMock(): jest.Mocked<JwtService> {
  return {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;
}

function makeCredential(
  overrides: Partial<AdminCredentialEntity> = {},
): AdminCredentialEntity {
  return Object.assign(
    new AdminCredentialEntity(
      'credential-id',
      'user-id',
      'password-hash',
      false,
      new Date('2026-01-01T00:00:00.000Z'),
    ),
    overrides,
  );
}

function executionContext(request: unknown): ExecutionContext {
  return {
    getClass: jest.fn(),
    getHandler: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

const validPayload: JwtPayload = {
  sub: 'user-id',
  userCode: 'ADMIN_CODE',
  role: UserRole.ADMIN,
  mustChangePassword: false,
  credentialVersion: '2026-01-01T00:00:00.000Z',
  type: 'ACCESS',
  iat: 1,
  exp: 2,
};

describe('AuthenticationService', () => {
  const compareMock = bcrypt.compare as unknown as jest.MockedFunction<
    (data: string | Buffer, encrypted: string) => Promise<boolean>
  >;
  const hashMock = bcrypt.hash as unknown as jest.MockedFunction<
    (data: string | Buffer, saltOrRounds: string | number) => Promise<string>
  >;

  beforeEach(() => {
    compareMock.mockReset();
    hashMock.mockReset();
  });

  it('logs in an active administrator and signs a versioned access token', async () => {
    const jwt = jwtServiceMock();
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    const user = makeUser({ role: UserRole.ADMIN, userCode: 'ADMIN_CODE' });
    const credential = makeCredential();
    users.findByEmail.mockResolvedValue(user);
    credentials.findByUserId.mockResolvedValue(credential);
    compareMock.mockResolvedValue(true);
    jwt.signAsync.mockResolvedValue('access-token');

    const result = await new AuthenticationService(
      jwt,
      users,
      credentials,
    ).loginAdmin('  ADMIN@EXAMPLE.COM ', 'ValidPass123');

    expect(users.findByEmail).toHaveBeenCalledWith('admin@example.com');
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      userCode: user.userCode,
      role: UserRole.ADMIN,
      mustChangePassword: false,
      credentialVersion: '2026-01-01T00:00:00.000Z',
      type: 'ACCESS',
    });
    expect(result.accessToken).toBe('access-token');
  });

  it('rejects invalid password lengths before querying repositories', async () => {
    const users = userRepositoryMock();
    const service = new AuthenticationService(
      jwtServiceMock(),
      users,
      credentialRepositoryMock(),
    );

    await expect(
      service.loginAdmin('admin@example.com', 'short'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_PASSWORD_LENGTH.code,
      }),
    });
    expect(users.findByEmail).not.toHaveBeenCalled();
  });

  it('equalizes timing and rejects missing or non-admin users', async () => {
    const users = userRepositoryMock();
    const service = new AuthenticationService(
      jwtServiceMock(),
      users,
      credentialRepositoryMock(),
    );
    compareMock.mockResolvedValue(false);
    users.findByEmail
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeUser({ role: UserRole.PARTICIPANT }));

    await expect(
      service.loginAdmin('missing@example.com', 'ValidPass123'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });
    await expect(
      service.loginAdmin('user@example.com', 'ValidPass123'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });
    expect(compareMock).toHaveBeenCalledTimes(2);
  });

  it('rejects inactive admins and invalid stored credentials', async () => {
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    const service = new AuthenticationService(
      jwtServiceMock(),
      users,
      credentials,
    );
    users.findByEmail
      .mockResolvedValueOnce(
        makeUser({ role: UserRole.ADMIN, status: UserStatus.INACTIVE }),
      )
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }))
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }));

    await expect(
      service.loginAdmin('admin@example.com', 'ValidPass123'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.ADMIN_ACCOUNT_INACTIVE.code,
      }),
    });

    credentials.findByUserId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeCredential());
    compareMock.mockResolvedValue(false);
    await expect(
      service.loginAdmin('admin@example.com', 'ValidPass123'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });
    await expect(
      service.loginAdmin('admin@example.com', 'ValidPass123'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });
  });

  it('promotes a participant and returns a temporary password', async () => {
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    users.findByUserCode.mockResolvedValue(makeUser());
    hashMock.mockResolvedValue('new-hash');
    credentials.promoteParticipantToAdmin.mockResolvedValue(
      makeCredential({ mustChangePassword: true }),
    );

    const result = await new AuthenticationService(
      jwtServiceMock(),
      users,
      credentials,
    ).promoteToAdmin('USER_CODE');

    expect(result).toMatchObject({
      userCode: 'USER_CODE',
      role: UserRole.ADMIN,
      mustChangePassword: true,
    });
    expect(result.temporaryPassword.length).toBeGreaterThanOrEqual(8);
    expect(hashMock).toHaveBeenCalledWith(result.temporaryPassword, 12);
  });

  it('rejects invalid promotion states', async () => {
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    const service = new AuthenticationService(
      jwtServiceMock(),
      users,
      credentials,
    );
    users.findByUserCode
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }))
      .mockResolvedValueOnce(makeUser());
    hashMock.mockResolvedValue('hash');
    credentials.promoteParticipantToAdmin.mockResolvedValue(null);

    await expect(service.promoteToAdmin('missing')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.USER_NOT_FOUND.code,
      }),
    });
    await expect(service.promoteToAdmin('admin')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.USER_CANNOT_BE_PROMOTED.code,
      }),
    });
    await expect(service.promoteToAdmin('USER_CODE')).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.USER_CANNOT_BE_PROMOTED.code,
      }),
    });
  });

  it('updates an admin password and rotates the credential version', async () => {
    const jwt = jwtServiceMock();
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    const user = makeUser({ role: UserRole.ADMIN, userCode: 'ADMIN_CODE' });
    const credential = makeCredential();
    const updated = makeCredential({
      passwordHash: 'new-hash',
      mustChangePassword: false,
      passwordChangedAt: new Date('2026-02-01T00:00:00.000Z'),
    });
    users.findByUserCode.mockResolvedValue(user);
    credentials.findByUserId.mockResolvedValue(credential);
    compareMock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    hashMock.mockResolvedValue('new-hash');
    credentials.updatePassword.mockResolvedValue(updated);
    jwt.signAsync.mockResolvedValue('rotated-token');

    const result = await new AuthenticationService(
      jwt,
      users,
      credentials,
    ).updateAdminPassword('ADMIN_CODE', 'CurrentPass1', 'DifferentPass2');

    expect(credentials.updatePassword).toHaveBeenCalledWith(
      user.id,
      'new-hash',
    );
    expect(result.accessToken).toBe('rotated-token');
    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        credentialVersion: '2026-02-01T00:00:00.000Z',
      }),
    );
  });

  it('validates all password update failure states', async () => {
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    const service = new AuthenticationService(
      jwtServiceMock(),
      users,
      credentials,
    );

    await expect(
      service.updateAdminPassword('USER', 'short', 'ValidNewPass1'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_PASSWORD_LENGTH.code,
      }),
    });

    users.findByUserCode
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeUser({ role: UserRole.PARTICIPANT }))
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }))
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }))
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }))
      .mockResolvedValueOnce(makeUser({ role: UserRole.ADMIN }));
    credentials.findByUserId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeCredential())
      .mockResolvedValueOnce(makeCredential())
      .mockResolvedValueOnce(makeCredential());

    await expect(
      service.updateAdminPassword('USER', 'CurrentPass1', 'DifferentPass2'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });
    await expect(
      service.updateAdminPassword('USER', 'CurrentPass1', 'DifferentPass2'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });
    await expect(
      service.updateAdminPassword('USER', 'CurrentPass1', 'DifferentPass2'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });

    compareMock.mockResolvedValueOnce(false);
    await expect(
      service.updateAdminPassword('USER', 'CurrentPass1', 'DifferentPass2'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });

    compareMock.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
    await expect(
      service.updateAdminPassword('USER', 'CurrentPass1', 'CurrentPass1'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.PASSWORD_UNCHANGED.code,
      }),
    });

    compareMock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    hashMock.mockResolvedValue('hash');
    credentials.updatePassword.mockResolvedValueOnce(null);
    await expect(
      service.updateAdminPassword('USER', 'CurrentPass1', 'DifferentPass2'),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ADMIN_CREDENTIALS.code,
      }),
    });
  });

  describe('initial super admin', () => {
    const config = environment.authentication.initialSuperAdmin;
    const validConfig = {
      name: ' Initial Admin ',
      email: ' ADMIN@EXAMPLE.COM ',
      jobPosition: ' Administrator ',
      enterprise: ' CATALISA ',
      password: 'ValidPass123',
    };

    afterEach(() => {
      Object.assign(config, {
        name: '',
        email: '',
        jobPosition: '',
        enterprise: '',
        password: '',
      });
    });

    it('rejects incomplete, duplicate-role and duplicate-email configuration', async () => {
      const users = userRepositoryMock();
      const service = new AuthenticationService(
        jwtServiceMock(),
        users,
        credentialRepositoryMock(),
      );

      await expect(service.createInitialSuperAdmin()).rejects.toMatchObject({
        response: expect.objectContaining({
          code: CatalisaCodes.INITIAL_SUPER_ADMIN_CONFIGURATION_INVALID.code,
        }),
      });

      Object.assign(config, validConfig);
      users.existsByRole
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      users.findByEmail.mockResolvedValueOnce(makeUser());
      await expect(service.createInitialSuperAdmin()).rejects.toMatchObject({
        response: expect.objectContaining({
          code: CatalisaCodes.SUPER_ADMIN_ALREADY_EXISTS.code,
        }),
      });
      await expect(service.createInitialSuperAdmin()).rejects.toMatchObject({
        response: expect.objectContaining({
          code: CatalisaCodes.EMAIL_ALREADY_EXISTS.code,
        }),
      });
    });

    it('creates a normalized initial super administrator', async () => {
      Object.assign(config, validConfig);
      const users = userRepositoryMock();
      const credentials = credentialRepositoryMock();
      users.existsByRole.mockResolvedValue(false);
      users.findByEmail.mockResolvedValue(null);
      hashMock.mockResolvedValue('password-hash');
      credentials.createInitialSuperAdmin.mockResolvedValue(
        makeCredential({ mustChangePassword: true }),
      );

      const result = await new AuthenticationService(
        jwtServiceMock(),
        users,
        credentials,
      ).createInitialSuperAdmin();

      const user = credentials.createInitialSuperAdmin.mock.calls[0]![0];
      expect(user).toMatchObject({
        name: 'Initial Admin',
        email: 'admin@example.com',
        jobPosition: 'Administrator',
        enterprise: 'CATALISA',
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      });
      expect(result).toMatchObject({
        email: 'admin@example.com',
        role: UserRole.SUPER_ADMIN,
        mustChangePassword: true,
      });
    });
  });
});

describe('authentication guards', () => {
  it('enforces configured roles', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValueOnce(undefined)
        .mockReturnValue([UserRole.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(executionContext({}))).toBe(true);
    expectSyncTokenError(
      () => guard.canActivate(executionContext({})),
      CatalisaCodes.ACCESS_DENIED.code,
    );
    expectSyncTokenError(
      () =>
        guard.canActivate(
          executionContext({ user: { role: UserRole.PARTICIPANT } }),
        ),
      CatalisaCodes.ACCESS_DENIED.code,
    );
    expect(
      guard.canActivate(executionContext({ user: { role: UserRole.ADMIN } })),
    ).toBe(true);
  });

  it('blocks only users that still must update their password', () => {
    const guard = new AdminPasswordUpdatedGuard();

    expectSyncTokenError(
      () =>
        guard.canActivate(
          executionContext({ user: { mustChangePassword: true } }),
        ),
      CatalisaCodes.PASSWORD_UPDATE_REQUIRED.code,
    );
    expect(
      guard.canActivate(
        executionContext({ user: { mustChangePassword: false } }),
      ),
    ).toBe(true);
    expect(guard.canActivate(executionContext({}))).toBe(true);
  });

  it('authenticates a current valid access token', async () => {
    const jwt = jwtServiceMock();
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    jwt.verifyAsync.mockResolvedValue(validPayload);
    users.findById.mockResolvedValue(
      makeUser({ role: UserRole.ADMIN, userCode: 'ADMIN_CODE' }),
    );
    credentials.findByUserId.mockResolvedValue(makeCredential());
    const request: { headers: { authorization?: string }; user?: JwtPayload } =
      {
        headers: { authorization: 'Bearer token' },
      };

    await expect(
      new JwtAuthGuard(jwt, users, credentials).canActivate(
        executionContext(request),
      ),
    ).resolves.toBe(true);
    expect(request.user).toEqual(validPayload);
  });

  it('rejects missing, malformed, invalid and stale access tokens', async () => {
    const jwt = jwtServiceMock();
    const users = userRepositoryMock();
    const credentials = credentialRepositoryMock();
    const guard = new JwtAuthGuard(jwt, users, credentials);

    await expect(
      guard.canActivate(executionContext({ headers: {} })),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.AUTHENTICATION_REQUIRED.code,
      }),
    });

    jwt.verifyAsync
      .mockRejectedValueOnce(new Error('invalid signature'))
      .mockResolvedValueOnce({ type: 'ACCESS' })
      .mockResolvedValueOnce(validPayload);
    await expect(
      guard.canActivate(
        executionContext({ headers: { authorization: 'Bearer bad' } }),
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ACCESS_TOKEN.code,
      }),
    });
    await expect(
      guard.canActivate(
        executionContext({ headers: { authorization: 'Bearer malformed' } }),
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ACCESS_TOKEN.code,
      }),
    });

    users.findById.mockResolvedValue(null);
    credentials.findByUserId.mockResolvedValue(makeCredential());
    await expect(
      guard.canActivate(
        executionContext({ headers: { authorization: 'Bearer stale' } }),
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: CatalisaCodes.INVALID_ACCESS_TOKEN.code,
      }),
    });
  });
});
