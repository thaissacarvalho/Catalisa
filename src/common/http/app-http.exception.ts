import { HttpException } from '@nestjs/common';
import { errorResponse } from '@app/common/http/error-response';
import { CatalisaErrorCode } from '@app/common/http/catalisa-codes';

export class AppHttpException extends HttpException {
  constructor(errorCode: CatalisaErrorCode) {
    super(errorResponse(errorCode), errorCode.statusCode);
  }
}
