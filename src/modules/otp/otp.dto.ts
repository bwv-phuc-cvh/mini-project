import { createZodDto } from 'nestjs-zod';
import { RequestOtpBodySchema, VerifyOtpBodySchema } from './otp.model';

export class RequestOtpBodyDTO extends createZodDto(RequestOtpBodySchema) {}
export class VerifyOtpBodyDTO extends createZodDto(VerifyOtpBodySchema) {}
