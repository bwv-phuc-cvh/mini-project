import z from 'zod';
import { RequestOtpBodySchema, VerifyOtpBodySchema } from './otp.model';

export type RequestOtpBodyType = z.infer<typeof RequestOtpBodySchema>;
export type VerifyOtpBodyType = z.infer<typeof VerifyOtpBodySchema>;
