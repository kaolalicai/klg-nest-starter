import { IsNotEmpty } from 'class-validator'
import { BaseResponse } from '@kalengo/web'

export class UserDto {
  @IsNotEmpty()
  readonly name!: string
  @IsNotEmpty()
  readonly phone!: string
}

export class AccountDto {
  @IsNotEmpty()
  userId!: string

  balance!: number
}

export class RegisterRes extends BaseResponse {
  readonly data!: UserDto
}
