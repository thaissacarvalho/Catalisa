import { TokenErrorCode } from '@app/common/http/token-codes';

export function errorResponse(errorCode: TokenErrorCode) {
  return {
    success: false,
    type: errorCode.type,
    code: errorCode.code,
    message: errorCode.message,
    statusCode: errorCode.statusCode,
  };
}
