import {Injectable, Logger, Inject} from '@nestjs/common'
import {UserDto} from './users.dto'
import {RedisService, RedlockService, BUFFER_LOCK, Redlock, MutexLock, LockKey, BufferLock} from '@kalengo/redis'
import * as assert from 'assert'
import * as bluebird from 'bluebird'

interface IDecoratorMutexParam {
  name: string
  list: string[]
}

@Injectable()
export class UsersService {
  constructor (
    private readonly redisService: RedisService,
    private readonly redlockService: RedlockService,
    @Inject(BUFFER_LOCK)
    private readonly bufferLock: Redlock
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

  async buffer () {
    return await this.bufferLock.using(async () => {
      await bluebird.delay(0.1)
      return await this.findAll()
    }, {resource: 'key2', ttl: 10})
  }

  async getAndSet () {
    const client = await this.redisService.getClient()
    let v = 'vvv'
    await client.setex('kk', 60, v)
    let value = await client.get('kk')
    Logger.log('value ' + value)
    assert(value === v)
  }

  @MutexLock({ttl: 1000000})
  async decoratorMutex (@LockKey('name') param: IDecoratorMutexParam) {
    return await this.findAll()
  }

  @BufferLock()
  async decoratorBuffer (@LockKey('name') param: IDecoratorMutexParam) {
    await bluebird.delay(0.1)
    return await this.findAll()
  }
}
