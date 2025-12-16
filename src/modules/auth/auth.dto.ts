import { createZodDto } from 'nestjs-zod';
import { ForgotPasswordBodySchema, LoginSchema, RegisterSchema, ResetPassowrdBodySchema } from './auth.model';

export class LoginBodyDTO extends createZodDto(LoginSchema) {}
export class RegisterDTO extends createZodDto(RegisterSchema) {}
export class ForgotPasswordDTO extends createZodDto(ForgotPasswordBodySchema) {}
export class ResetPasswordDTO extends createZodDto(ResetPassowrdBodySchema) {}
