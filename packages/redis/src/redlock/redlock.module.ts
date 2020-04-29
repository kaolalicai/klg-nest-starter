import { DynamicModule, Module, Provider, Global, Inject } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'
import { Redlock } from './Redlock'
import { RedisModuleBuilder } from '../ioredis/redis.module.builder'
import { BufferOptions } from './redlock.interface'
import { RedlockService } from './redlock.service'
import {
  REDLOCK_MODULE_OPTIONS,
  MUTEX_LOCK,
  BUFFER_LOCK
} from './redlock.constants'

export const createMutexLockClient = (): Provider => ({
  provide: MUTEX_LOCK,
  useFactory: async (redisService: RedisService): Promise<Redlock> => {
    const client = redisService.getClient()
    const mutexLock = new Redlock(client, {
      retryCount: 0
    })
    return mutexLock
  },
  inject: [RedisService]
})

export const createBufferLockClient = (): Provider => ({
  provide: BUFFER_LOCK,
  useFactory: async (
    redisService: RedisService,
    options: BufferOptions
  ): Promise<Redlock> => {
    const client = redisService.getClient()
    const defaultOptions = {
      retryCount: Math.floor((1000 * 60 * 15) / 400), // 重试次数 这里需要重试10分钟
      retryDelay: 400 // 重试间隔
    }
    const bufferLock = new Redlock(
      client,
      Object.assign(defaultOptions, options)
    )
    return bufferLock
  },
  inject: [RedisService, REDLOCK_MODULE_OPTIONS]
})

@Global()
@Module({
  imports: [RedisModuleBuilder.forRoot()],
  providers: [RedlockService],
  exports: [RedlockService, BUFFER_LOCK, MUTEX_LOCK]
})
export class RedlockModule {
  constructor(
    @Inject(REDLOCK_MODULE_OPTIONS)
    private readonly options: BufferOptions
  ) {}

  static forRoot(options?: BufferOptions): DynamicModule {
    return {
      module: RedlockModule,
      providers: [
        createMutexLockClient(),
        createBufferLockClient(),
        { provide: REDLOCK_MODULE_OPTIONS, useValue: options || {} }
      ],
      exports: [RedlockService]
    }
  }
}
