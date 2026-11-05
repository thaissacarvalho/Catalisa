import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';

@Injectable()
export class AdminPasswordUpdatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();

    if (request.user?.mustChangePassword) {
      throw new AppHttpException(CatalisaCodes.PASSWORD_UPDATE_REQUIRED);
    }

    return true;
  }
}
