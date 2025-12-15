import z from 'zod';
import { LoginSchema, RegisterSchema } from './auth.model';

export type LoginBodyType = z.infer<typeof LoginSchema>;
export type RegisterBodyType = z.infer<typeof RegisterSchema>;
