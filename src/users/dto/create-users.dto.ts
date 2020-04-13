import {IsNotEmpty} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class CreateUsersDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly name!: string
  @IsNotEmpty()
  @ApiProperty()
  readonly phone!: string
}
