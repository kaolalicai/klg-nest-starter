import { Injectable } from '@nestjs/common'
import { UserDto } from './users.dto'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class UsersService {
  async register (createUsersDto: UserDto): Promise<UserDto> {
    return createUsersDto
  }

  async findAll (): Promise<number[]> {
    return [1, 2, 3, 4]
  }
}
