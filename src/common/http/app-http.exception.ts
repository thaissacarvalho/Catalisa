import { HttpException } from '@nestjs/common';
import { errorResponse } from '@app/common/http/error-response';
import { TokenErrorCode } from '@app/common/http/token-codes';

export class AppHttpException extends HttpException {
  constructor(errorCode: TokenErrorCode) {
    super(errorResponse(errorCode), errorCode.statusCode);
  }
}
