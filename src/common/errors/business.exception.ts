import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code';

export class BusinessException extends AppException {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, ErrorCode.BUSINESS_ERROR, message);
  }
}
