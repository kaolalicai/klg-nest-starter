import { HttpException, HttpStatus } from '@nestjs/common'

export class BusinessException extends HttpException {
  constructor() {
    super('Business Error', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  getCode() {
    return 1
  }
}
