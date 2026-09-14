import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { environment } from '@app/config/environment';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import {
  ADMIN_CREDENTIAL_REPOSITORY,
  AdminCredentialRepository,
} from '@app/common/authentication/domain/repositories/admin-credential.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { generateUserCode } from '@app/utils/generateUserCode';
import { randomBytes, randomUUID } from 'node:crypto';
import { UserEntity } from '@app/users/domain/entities/user.entity';

// Public dummy hash used only to equalize invalid-login response time.
const INVALID_ADMIN_PASSWORD_HASH =
  '$2b$12$MELp0E97iHDwgli5ZgvZ1eO6b7AwmJ6ipwJKY3VxIt1B2MRuh5rom';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject(ADMIN_CREDENTIAL_REPOSITORY)
    private readonly adminCredentialRepository: AdminCredentialRepository,
  ) {}

  async loginAdmin(email: string, password: string) {
    this.assertBcryptPasswordLength(password);

    const user = await this.userRepository.findByEmail(
      email.trim().toLowerCase(),
    );

    if (!user || ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      await bcrypt.compare(password, INVALID_ADMIN_PASSWORD_HASH);
      throw new AppHttpException(TokenCodes.INVALID_ADMIN_CREDENTIALS);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppHttpException(TokenCodes.ADMIN_ACCOUNT_INACTIVE);
    }

    const credential = await this.adminCredentialRepository.findByUserId(
      user.id,
    );
    const passwordHash =
      credential?.passwordHash ?? INVALID_ADMIN_PASSWORD_HASH;
    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (!credential || !passwordMatches) {
      throw new AppHttpException(TokenCodes.INVALID_ADMIN_CREDENTIALS);
    }

    return {
      accessToken: await this.signAccessToken(
        user.id,
        user.userCode,
        user.role,
        credential.mustChangePassword,
        credential.passwordChangedAt,
      ),
      user: {
        userCode: user.userCode,
        role: user.role,
        mustChangePassword: credential.mustChangePassword,
      },
    };
  }

  async promoteToAdmin(userCode: string) {
    const user = await this.userRepository.findByUserCode(userCode);

    if (!user) {
      throw new AppHttpException(TokenCodes.USER_NOT_FOUND);
    }

    if (user.role !== UserRole.PARTICIPANT) {
      throw new AppHttpException(TokenCodes.USER_CANNOT_BE_PROMOTED);
    }

    const temporaryPassword = randomBytes(24).toString('base64url');
    this.assertBcryptPasswordLength(temporaryPassword);

    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    const credential =
      await this.adminCredentialRepository.promoteParticipantToAdmin(
        user.id,
        passwordHash,
      );

    if (!credential) {
      throw new AppHttpException(TokenCodes.USER_CANNOT_BE_PROMOTED);
    }

    return {
      userCode: user.userCode,
      role: UserRole.ADMIN,
      mustChangePassword: credential.mustChangePassword,
      temporaryPassword,
    };
  }

  async updateAdminPassword(
    userCode: string,
    currentPassword: string,
    newPassword: string,
  ) {
    this.assertBcryptPasswordLength(currentPassword);
    this.assertBcryptPasswordLength(newPassword);

    const user = await this.userRepository.findByUserCode(userCode);

    if (!user || ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new AppHttpException(TokenCodes.INVALID_ADMIN_CREDENTIALS);
    }

    const credential = await this.adminCredentialRepository.findByUserId(
      user.id,
    );

    if (
      !credential ||
      !(await bcrypt.compare(currentPassword, credential.passwordHash))
    ) {
      throw new AppHttpException(TokenCodes.INVALID_ADMIN_CREDENTIALS);
    }

    if (await bcrypt.compare(newPassword, credential.passwordHash)) {
      throw new AppHttpException(TokenCodes.PASSWORD_UNCHANGED);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    const updatedCredential =
      await this.adminCredentialRepository.updatePassword(
        user.id,
        passwordHash,
      );

    if (!updatedCredential) {
      throw new AppHttpException(TokenCodes.INVALID_ADMIN_CREDENTIALS);
    }

    return {
      accessToken: await this.signAccessToken(
        user.id,
        user.userCode,
        user.role,
        updatedCredential.mustChangePassword,
        updatedCredential.passwordChangedAt,
      ),
      user: {
        userCode: user.userCode,
        role: user.role,
        mustChangePassword: updatedCredential.mustChangePassword,
      },
    };
  }

  private assertBcryptPasswordLength(password: string): void {
    const characterLength = Array.from(password).length;
    const byteLength = Buffer.byteLength(password, 'utf8');

    if (characterLength < 8 || byteLength > 72) {
      throw new AppHttpException(TokenCodes.INVALID_PASSWORD_LENGTH);
    }
  }

  private signAccessToken(
    id: string,
    userCode: string,
    role: UserRole,
    mustChangePassword: boolean,
    passwordChangedAt: Date | null,
  ): Promise<string> {
    return this.jwtService.signAsync({
      sub: id,
      userCode,
      role,
      mustChangePassword,
      credentialVersion: passwordChangedAt?.toISOString() ?? null,
      type: 'ACCESS',
    });
  }

  async createInitialSuperAdmin() {
    const config = environment.authentication.initialSuperAdmin;

    if (
      !config.name ||
      !config.email ||
      !config.jobPosition ||
      !config.enterprise ||
      !config.password
    ) {
      throw new AppHttpException(
        TokenCodes.INITIAL_SUPER_ADMIN_CONFIGURATION_INVALID,
      );
    }

    const superAdminExists = await this.userRepository.existsByRole(
      UserRole.SUPER_ADMIN,
    );

    if (superAdminExists) {
      throw new AppHttpException(TokenCodes.SUPER_ADMIN_ALREADY_EXISTS);
    }

    const normalizedEmail = config.email.trim().toLowerCase();

    const emailAlreadyExists =
      await this.userRepository.findByEmail(normalizedEmail);

    if (emailAlreadyExists) {
      throw new AppHttpException(TokenCodes.EMAIL_ALREADY_EXISTS);
    }

    this.assertBcryptPasswordLength(config.password);

    const user = new UserEntity(
      randomUUID(),
      config.name.trim(),
      normalizedEmail,
      UserStatus.ACTIVE,
      UserRole.SUPER_ADMIN,
      config.jobPosition.trim(),
      config.enterprise.trim(),
      generateUserCode(),
    );

    const passwordHash = await bcrypt.hash(config.password, 12);

    const credential =
      await this.adminCredentialRepository.createInitialSuperAdmin(
        user,
        passwordHash,
      );

    return {
      userCode: user.userCode,
      email: user.email,
      role: user.role,
      mustChangePassword: credential.mustChangePassword,
    };
  }
}
