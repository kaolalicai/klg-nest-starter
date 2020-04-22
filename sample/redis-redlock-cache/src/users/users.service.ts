import {Injectable, Logger, Inject} from '@nestjs/common'
import {UserDto} from './users.dto'
import {RedisService, RedlockService} from '@kalengo/redis'
import * as assert from 'assert'

@Injectable()
export class UsersService {
  constructor (
    private readonly redisService: RedisService,
    private readonly redlockService: RedlockService
  ) {
    // blank
  }

  async register (createUsersDto: UserDto) {
    return 'success'
  }

  async findAll () {
    return [1, 2, 3, 4, 5]
  }

  async mutex () {
    return await this.redlockService.getMutex().using(async () => {
      return await this.findAll()
    }, {resource: 'key1', ttl: 10})
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
