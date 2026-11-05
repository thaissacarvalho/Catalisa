import { CatalisaErrorCode } from '@app/common/http/catalisa-codes';

export function errorResponse(errorCode: CatalisaErrorCode) {
  return {
    success: false,
    type: errorCode.type,
    code: errorCode.code,
    message: errorCode.message,
    statusCode: errorCode.statusCode,
  };
}
