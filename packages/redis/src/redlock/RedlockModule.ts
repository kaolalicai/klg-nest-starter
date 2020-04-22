import {DynamicModule, Module, Provider, Global} from '@nestjs/common'
import {RedisService} from 'nestjs-redis'
import {Redlock} from './Redlock'
import {RedisModuleBuilder} from '../ioredis/RedisModuleBuilder'
import {MUTEX_LOCK} from './RedlockInterface'
import {RedlockService} from './RedlockService'

@Global()
@Module({
  imports: [RedisModuleBuilder.forRoot()],
  providers: [RedlockService],
  exports: [RedlockService]
})
export class RedlockModule {
  static forRoot (): DynamicModule {
    return {
      module: RedlockModule,
      providers: [
        createLockClient()
        // {provide: REDIS_SERVICE, useValue: RedisService}
      ],
      exports: [RedlockService]
    }
  }
}

export const createLockClient = (): Provider => ({
  provide: MUTEX_LOCK,
  useFactory: async (redisService: RedisService): Promise<Redlock> => {
    let client = redisService.getClient()
    // let defaultOptions = {
    //   retryCount: Math.floor(1000 * 60 * 15 / 400), // 重试次数 这里需要重试10分钟
    //   retryDelay: 400   // 重试间隔
    // }
    // const bufferLock = new Redlock(client, Object.assign(defaultOptions, bufferOptions))
    const mutexLock = new Redlock(client, {
      retryCount: 0
    })
    return mutexLock
  },
  inject: [RedisService]
})
