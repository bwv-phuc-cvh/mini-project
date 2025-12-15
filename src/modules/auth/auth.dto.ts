import { createZodDto } from 'nestjs-zod';
import { LoginSchema, RegisterSchema } from './auth.model';

export class LoginBodyDTO extends createZodDto(LoginSchema) {}
export class RegisterDTO extends createZodDto(RegisterSchema) {}
