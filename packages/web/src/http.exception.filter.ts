import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { logger } from '@kalengo/utils'
import { BusinessException } from './exceptions/business.exception'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const message = exception.message
    logger.info('系统内部错误', message)

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const code =
      exception instanceof BusinessException ? exception.getCode() : status

    const errorResponse = {
      message: message,
      code: code, // 自定义code
      url: request.originalUrl // 错误的url地址
    }
    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
