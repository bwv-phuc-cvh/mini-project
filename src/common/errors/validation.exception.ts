import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code';

export class ValidationException extends AppException {
  constructor(errors: { field: string; error: string }[]) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_ERROR, errors);
  }
}
