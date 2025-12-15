import { OtpPurpose } from 'generated/prisma';
import z from 'zod';

export const RequestOtpBodySchema = z
  .object({
    email: z.string().email(),
    purpose: z.enum(OtpPurpose),
  })
  .strict();

export const VerifyOtpBodySchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    purpose: z.enum(OtpPurpose),
  })
  .strict();
