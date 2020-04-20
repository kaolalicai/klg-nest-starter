import {Injectable} from '@nestjs/common'
import {UserDto} from './users.dto'

@Injectable()
export class UsersService {
  constructor () {
    // blank
  }

  async register (createUsersDto: UserDto) {
    return 'successs'
  }

  async findAll () {
    return [1, 2, 3, 4, 5]
  }
}
