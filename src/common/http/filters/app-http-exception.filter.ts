import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { errorResponse } from '@app/common/http/error-response';
import { TokenCodes } from '@app/common/http/token-codes';

@Catch()
export class AppHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof AppHttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorCode = this.getErrorCode(statusCode);

    response.status(statusCode).json(errorResponse(errorCode));
  }

  private getErrorCode(statusCode: number) {
    if (statusCode === HttpStatus.BAD_REQUEST) {
      return TokenCodes.INVALID_REQUEST;
    }
    if (statusCode === HttpStatus.UNAUTHORIZED) {
      return TokenCodes.AUTHENTICATION_REQUIRED;
    }
    if (statusCode === HttpStatus.FORBIDDEN) {
      return TokenCodes.FORBIDDEN;
    }
    if (statusCode === HttpStatus.NOT_FOUND) {
      return TokenCodes.RESOURCE_NOT_FOUND;
    }
    if (statusCode === HttpStatus.CONFLICT) {
      return TokenCodes.CONFLICT;
    }

    return TokenCodes.INTERNAL_SERVER_ERROR;
  }
}
