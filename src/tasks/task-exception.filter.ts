import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class TaskExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {

    const context = host.switchToHttp();

    const request = context.getRequest();
    const response = context.getResponse();

    const status =
      exception.getStatus ? exception.getStatus() : 500;

    const message =
      exception.message || 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}