import { Injectable } from '@nestjs/common'
import { UserDto } from './users.dto'

@Injectable()
export class UsersService {
  constructor() {}

  async register(createUsersDto: UserDto): Promise<string> {
    return 'register success'
  }

  async findAll(): Promise<number[]> {
    return [1, 2, 3, 4, 5]
  }

  async update(userId: string): Promise<string> {
    return 'update success'
  }
}
