import { TokenSuccessCode } from '@app/common/http/token-codes';

export function successResponse<T>(successCode: TokenSuccessCode, data: T) {
  return {
    success: true,
    type: successCode.type,
    code: successCode.code,
    message: successCode.message,
    statusCode: successCode.statusCode,
    data,
  };
}
