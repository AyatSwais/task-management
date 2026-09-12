import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

@Injectable()
export class TaskLoggingInterceptor implements NestInterceptor {

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const now = Date.now();
    console.log(`Before Controller ${now}`);

    

    return next.handle().pipe(
      tap(() => {
        console.log(
         ` After Controller: ${Date.now() - now}ms `,
        );
      }),
    );
  }
}