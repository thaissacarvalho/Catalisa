import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';

@Injectable()
export class AdminPasswordUpdatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();

    if (request.user?.mustChangePassword) {
      throw new AppHttpException(TokenCodes.PASSWORD_UPDATE_REQUIRED);
    }

    return true;
  }
}
