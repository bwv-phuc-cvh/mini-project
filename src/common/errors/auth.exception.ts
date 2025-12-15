import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code';

export class UnauthorizedAppException extends AppException {
  constructor(message = 'Unauthorized') {
    super(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, message);
  }
}
