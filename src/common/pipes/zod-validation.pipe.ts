import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ValidationException } from '../errors/validation.exception';

const CustomZodValidationPipe: typeof ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) =>
    new ValidationException(
      error.issues.map((issue) => ({
        field: issue.path.join('.'),
        error: issue.message,
      })),
    ),
});

export default CustomZodValidationPipe;
