import { CatalisaSuccessCode } from '@app/common/http/catalisa-codes';

export function successResponse<T>(successCode: CatalisaSuccessCode, data: T) {
  return {
    success: true,
    type: successCode.type,
    code: successCode.code,
    message: successCode.message,
    statusCode: successCode.statusCode,
    data,
  };
}
