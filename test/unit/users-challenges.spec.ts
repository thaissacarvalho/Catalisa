import { ChallengePresenter } from '@app/challenges/application/presenters/challenge.presenter';
import { FindAllChallengeUseCase } from '@app/challenges/application/use-cases/find-all-challenge.use-case';
import { FindIdChallengeUseCase } from '@app/challenges/application/use-cases/find-id-challenge.use-case';
import { UpdateChallengeStatusUseCase } from '@app/challenges/application/use-cases/update-challenge-status.use-case';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';
import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { TokenCodes } from '@app/common/http/token-codes';
import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';
import { ListAllUsersUseCase } from '@app/users/application/use-cases/list-all-users.use-case';
import { ListUserByEmailUseCase } from '@app/users/application/use-cases/list-user-by-email.use-case';
import { ListUserByIdUseCase } from '@app/users/application/use-cases/list-user-by-id.use-case';
import { ListUserByUserCodeUseCase } from '@app/users/application/use-cases/list-user-by-user-code.use-case';
import { UpdateUserStatusUseCase } from '@app/users/application/use-cases/update-user-status.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { makeChallenge, makeUser } from '@test/unit/factories';

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

function challengeRepositoryMock(): jest.Mocked<ChallengeRepository> {
  return {
    existsActiveById: jest.fn(),
    findAllActive: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };
}

describe('users use cases', () => {
  it('creates a normalized participant', async () => {
    const repository = userRepositoryMock();
    
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockImplementation(async (user) => user);
    
    const useCase = new CreateUserUseCase(repository);

    const result = await useCase.execute({
      name: '  Thaissa  ',
      email: '  THAISSA@EXAMPLE.COM ',
      jobPosition: '  Developer ',
      enterprise: '  Token ',
    });

    expect(repository.findByEmail).toHaveBeenCalledWith('thaissa@example.com');
    expect(result).toMatchObject({
      name: 'Thaissa',
      email: 'thaissa@example.com',
      jobPosition: 'Developer',
      enterprise: 'Token',
      role: UserRole.PARTICIPANT,
      status: UserStatus.ACTIVE,
    });
    expect(result.id).toBeTruthy();
    expect(result.userCode).toMatch(/^USER_[a-f0-9]{32}$/);
  });

  it('rejects an existing email', async () => {
    const repository = userRepositoryMock();
    repository.findByEmail.mockResolvedValue(makeUser());
    
    const useCase = new CreateUserUseCase(repository);

    await expect(
      useCase.execute({
        name: 'User',
        email: 'user@example.com',
        jobPosition: 'Developer',
        enterprise: 'Token',
      }),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.USER_ALREADY_EXISTS.code,
      }),
    });

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('lists all users and rejects an empty result', async () => {
    const repository = userRepositoryMock();
    const user = makeUser();
    const useCase = new ListAllUsersUseCase(repository);
    
    repository.findAll.mockResolvedValueOnce([user]).mockResolvedValueOnce([]);

    await expect(useCase.execute()).resolves.toEqual([user]);
    await expect(useCase.execute()).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.USER_NOT_FOUND.code,
      }),
    });
  });

  it.each([
    [
      'email',
      ListUserByEmailUseCase,
      'findByEmail',
      'user@example.com',
      TokenCodes.EMAIL_NOT_FOUND.code,
    ],
    [
      'id',
      ListUserByIdUseCase,
      'findById',
      'user-id',
      TokenCodes.USER_NOT_FOUND.code,
    ],
    [
      'user code',
      ListUserByUserCodeUseCase,
      'findByUserCode',
      'USER_CODE',
      TokenCodes.USER_NOT_FOUND.code,
    ],
  ] as const)(
    'finds a user by %s and handles not found',
    async (_label, UseCase, method, value, errorCode) => {
      const repository = userRepositoryMock();
      const user = makeUser();
      
      repository[method]
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(null);
      
        const useCase = new UseCase(repository);

      await expect(useCase.execute(value)).resolves.toBe(user);
      await expect(useCase.execute(value)).rejects.toMatchObject({
        response: expect.objectContaining({ code: errorCode }),
      });
    },
  );

  it('updates a user status', async () => {
    const repository = userRepositoryMock();
    const existing = makeUser();
    const updated = makeUser({ status: UserStatus.BLOCKED });
    
    repository.findByUserCode.mockResolvedValue(existing);
    repository.updateStatusByUserCode.mockResolvedValue(updated);

    const result = await new UpdateUserStatusUseCase(repository).execute(
      'USER_CODE',
      UserStatus.BLOCKED,
    );

    expect(result).toBe(updated);
    expect(repository.updateStatusByUserCode).toHaveBeenCalledWith(
      'USER_CODE',
      UserStatus.BLOCKED,
    );
  });

  it('rejects status updates when the user is missing or disappears', async () => {
    const repository = userRepositoryMock();
    const useCase = new UpdateUserStatusUseCase(repository);
    
    repository.findByUserCode.mockResolvedValueOnce(null);

    await expect(
      useCase.execute('MISSING', UserStatus.BLOCKED),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.USER_NOT_FOUND.code,
      }),
    });

    repository.findByUserCode.mockResolvedValueOnce(makeUser());
    repository.updateStatusByUserCode.mockResolvedValueOnce(null);
    
    await expect(
      useCase.execute('USER_CODE', UserStatus.BLOCKED),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.USER_NOT_FOUND.code,
      }),
    });
  });
});

describe('challenge use cases and presenter', () => {
  it('lists active challenges', async () => {
    const repository = challengeRepositoryMock();
    const challenge = makeChallenge();
    
    repository.findAllActive.mockResolvedValue([challenge]);

    await expect(
      new FindAllChallengeUseCase(repository).execute(),
    ).resolves.toEqual([challenge]);
  });

  it('returns only an active challenge', async () => {
    const repository = challengeRepositoryMock();
    const useCase = new FindIdChallengeUseCase(repository);
    const active = makeChallenge();
    repository.findById
      .mockResolvedValueOnce(active)
      .mockResolvedValueOnce(
        makeChallenge({ status: ChallengeStatus.INACTIVE }),
      )
      .mockResolvedValueOnce(null);

    await expect(useCase.execute(active.id)).resolves.toBe(active);
    
    await expect(useCase.execute(active.id)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.CHALLENGE_NOT_FOUND.code,
      }),
    });
    
    await expect(useCase.execute(active.id)).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.CHALLENGE_NOT_FOUND.code,
      }),
    });
  });

  it('updates a challenge status and validates all failure states', async () => {
    const repository = challengeRepositoryMock();
    const useCase = new UpdateChallengeStatusUseCase(repository);
    const active = makeChallenge();
    const inactive = makeChallenge({ status: ChallengeStatus.INACTIVE });

    repository.findById.mockResolvedValueOnce(null);
    
    await expect(
      useCase.execute(active.id, ChallengeStatus.INACTIVE),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.CHALLENGE_NOT_FOUND.code,
      }),
    });

    repository.findById.mockResolvedValueOnce(active);
    
    await expect(
      useCase.execute(active.id, ChallengeStatus.ACTIVE),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.CHALLENGE_STATUS_UNCHANGED.code,
      }),
    });

    repository.findById.mockResolvedValueOnce(active);
    repository.updateStatus.mockResolvedValueOnce(null);
    
    await expect(
      useCase.execute(active.id, ChallengeStatus.INACTIVE),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: TokenCodes.CHALLENGE_NOT_FOUND.code,
      }),
    });

    repository.findById.mockResolvedValueOnce(active);
    repository.updateStatus.mockResolvedValueOnce(inactive);

    await expect(
      useCase.execute(active.id, ChallengeStatus.INACTIVE),
    ).resolves.toBe(inactive);
  });

  it('presents public and status-updated challenge views', () => {
    const challenge = makeChallenge();

    expect(ChallengePresenter.public(challenge)).toEqual({
      id: challenge.id,
      code: challenge.code,
      title: challenge.title,
      description: challenge.description,
      status: challenge.status,
      displayOrder: challenge.displayOrder,
    });

    expect(ChallengePresenter.statusUpdated(challenge)).toEqual({
      id: challenge.id,
      code: challenge.code,
      status: challenge.status,
      updatedAt: challenge.updatedAt,
    });
  });
});
