import {Injectable, Logger} from '@nestjs/common'
import {UserDto} from './users.dto'
import {RedisService} from '@kalengo/redis'
import * as assert from 'assert'

@Injectable()
export class UsersService {
  constructor (private readonly redisService: RedisService) {
    // blank
  }

  async register (createUsersDto: UserDto) {
    return 'success'
  }

  async findAll () {
    return [1, 2, 3, 4, 5]
  }

  async getAndSet () {
    const client = await this.redisService.getClient()
    let v = 'vvv'
    await client.setex('kk', 60, v)
    let value = await client.get('kk')
    Logger.log('value ' + value)
    assert(value === v)
  }
}
