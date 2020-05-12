import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { logger } from '@kalengo/utils'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const now = Date.now()
    return next.handle().pipe(
      tap((data) => {
        logger.info(`After... use time ${Date.now() - now}ms`)
        logger.info(`After... query `, request.query)
        logger.info(`After... body `, request.body)
        logger.info(`After... params `, request.params)
        logger.info(`After... response `, data)
      }),
      catchError((error) => {
        const response = context.switchToHttp().getResponse()
        logger.error(
          `${response.statusCode} | ${request.url} - ${error.message} - ${
            Date.now() - now
          }ms`
        )
        return throwError(error)
      })
    )
  }
}
