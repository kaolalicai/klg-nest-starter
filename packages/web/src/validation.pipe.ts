import { Injectable, ValidationPipe, ValidationError } from '@nestjs/common'
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util'

@Injectable()
export class ParamsValidationPipe extends ValidationPipe {
  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new HttpErrorByCode[this.errorHttpStatusCode]()
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const errors = this.flattenValidationErrors(validationErrors)
      return new HttpErrorByCode[this.errorHttpStatusCode](errors.join(';'))
    }
  }
}
