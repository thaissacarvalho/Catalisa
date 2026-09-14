import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import {
  ADMIN_CREDENTIAL_REPOSITORY,
  AdminCredentialRepository,
} from '@app/common/authentication/domain/repositories/admin-credential.repository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject(ADMIN_CREDENTIAL_REPOSITORY)
    private readonly adminCredentialRepository: AdminCredentialRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string }; user?: JwtPayload }>();
    const token = request.headers.authorization?.startsWith('Bearer ')
      ? request.headers.authorization.slice(7)
      : undefined;

    if (!token) {
      throw new AppHttpException(TokenCodes.AUTHENTICATION_REQUIRED);
    }

    try {
      const payload: unknown = await this.jwtService.verifyAsync(token);

      if (!this.isAccessTokenPayload(payload)) {
        throw new Error('Invalid access token payload');
      }

      const [user, credential] = await Promise.all([
        this.userRepository.findById(payload.sub),
        this.adminCredentialRepository.findByUserId(payload.sub),
      ]);

      const currentCredentialVersion =
        credential?.passwordChangedAt?.toISOString() ?? null;

      if (
        !user ||
        !credential ||
        user.status !== UserStatus.ACTIVE ||
        user.userCode !== payload.userCode ||
        user.role !== payload.role ||
        credential.mustChangePassword !== payload.mustChangePassword ||
        currentCredentialVersion !== payload.credentialVersion
      ) {
        throw new Error('Stale access token');
      }

      request.user = payload;
      return true;
    } catch {
      throw new AppHttpException(TokenCodes.INVALID_ACCESS_TOKEN);
    }
  }

  private isAccessTokenPayload(payload: unknown): payload is JwtPayload {
    if (typeof payload !== 'object' || payload === null) {
      return false;
    }

    const candidate = payload as Partial<JwtPayload>;

    return (
      candidate.type === 'ACCESS' &&
      typeof candidate.sub === 'string' &&
      candidate.sub.length > 0 &&
      typeof candidate.userCode === 'string' &&
      candidate.userCode.length > 0 &&
      Object.values(UserRole).includes(candidate.role as UserRole) &&
      typeof candidate.mustChangePassword === 'boolean' &&
      (candidate.credentialVersion === null ||
        typeof candidate.credentialVersion === 'string') &&
      typeof candidate.iat === 'number' &&
      typeof candidate.exp === 'number'
    );
  }
}
