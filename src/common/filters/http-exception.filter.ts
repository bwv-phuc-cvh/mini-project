import { Catch, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // AppException → đã format sẵn
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return res.status(status).json({
        success: false,
        ...(typeof response === 'string' ? { message: response } : response),
      });
    }

    // Unknown error
    return res.status(500).json({
      success: false,
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    });
  }
}
