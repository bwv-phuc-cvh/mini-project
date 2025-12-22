import z from 'zod';
import {
  ChangePasswordBodySchema,
  ForgotPasswordBodySchema,
  LoginSchema,
  RegisterSchema,
  ResetPassowrdBodySchema,
} from './auth.model';

export type LoginBodyType = z.infer<typeof LoginSchema>;
export type RegisterBodyType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>;
export type ResetPasswordBodyType = z.infer<typeof ResetPassowrdBodySchema>;
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>;
