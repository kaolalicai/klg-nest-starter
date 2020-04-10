import {IsNotEmpty} from 'class-validator'

export class CreateUsersDto {
  @IsNotEmpty()
  readonly name: string
  @IsNotEmpty()
  readonly phone: string
}
