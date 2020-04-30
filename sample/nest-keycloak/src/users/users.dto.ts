import { IsNotEmpty } from 'class-validator'
import { BaseResponse } from '@kalengo/web'

export class UserDto {
  @IsNotEmpty()
  readonly name!: string
  @IsNotEmpty()
  readonly phone!: string
}

export class RegisterRes extends BaseResponse {
  readonly data!: UserDto
}
