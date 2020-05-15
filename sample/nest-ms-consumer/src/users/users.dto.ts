import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { BaseResponse } from '@kalengo/web'

export class UserDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly name!: string
  @IsNotEmpty()
  @ApiProperty()
  readonly phone!: string
}

export class AccountDto {
  @IsNotEmpty()
  @ApiProperty()
  userId!: string

  @ApiProperty()
  balance!: number
}

export class RegisterRes extends BaseResponse {
  @ApiProperty({ type: UserDto })
  readonly data!: UserDto
}

export class FindAccountRes extends BaseResponse {
  @ApiProperty({ type: AccountDto })
  readonly data!: AccountDto
}

export class FindUsersRes extends BaseResponse {
  @ApiProperty({ type: [AccountDto] })
  readonly data!: AccountDto[]
}
