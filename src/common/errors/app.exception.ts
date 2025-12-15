import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-code';

export class AppException extends HttpException {
  constructor(status: HttpStatus, code: ErrorCode, message: any) {
    super(
      {
        statusCode: status,
        code,
        message,
      },
      status,
    );
  }
}
