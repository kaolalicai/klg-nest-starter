import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import {
  RedisModuleBuilder,
  RedisService,
  Redlock,
  RedlockModule,
  RedlockService
} from '@kalengo/redis'
import Mock = jest.Mock

describe('UsersService', () => {
  let usersService: UsersService
  let redisService: RedisService
  let spy: Mock = jest.fn((originFunction, param) => Promise.resolve())
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [RedisModuleBuilder.forRoot(), RedlockModule.forRoot()],
      providers: [
        {
          provide: RedlockService,
          useValue: {
            getMutex: () => {
              const redlock: { using: Function } = { using: () => 0 }
              redlock.using = spy
              return redlock
            },
            getBuffer: () => {
              const redlock: { using: Function } = { using: () => 0 }
              redlock.using = spy
              return redlock
            }
          }
        },
        UsersService
      ]
    }).compile()
    usersService = module.get<UsersService>(UsersService)
  })

  describe('decorator mutex', () => {
    const resourceValue = 'testKey'
    it('should ttl work', async () => {
      await usersService.decoratorMutex({ list: [], name: resourceValue })
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: resourceValue,
        ttl: 1000
      })
    })

    it('should decorator key work', async () => {
      await usersService.decoratorMutexByDecoratorKey()
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: 'DecoratorKey',
        ttl: 60000
      })
    })

    it('should decorator option key work', async () => {
      await usersService.decoratorMutexByDecoratorOptionKey()
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: 'DecoratorOptionKey',
        ttl: 1000000
      })
    })

    it('should LockKey work', async () => {
      await usersService.decoratorMutexByKey('testKey')
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: 'testKey',
        ttl: 1000000
      })
    })
  })

  describe('decorator buffer', () => {
    const resourceValue = 'testKey'
    it('should ttl work', async () => {
      await usersService.decoratorBuffer({ list: [], name: resourceValue })
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: resourceValue,
        ttl: 1000
      })
    })

    it('should decorator key work', async () => {
      await usersService.decoratorBufferByDecoratorKey()
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: 'DecoratorKey',
        ttl: 60000
      })
    })

    it('should decorator option key work', async () => {
      await usersService.decoratorBufferByDecoratorOptionKey()
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: 'DecoratorOptionKey',
        ttl: 1000000
      })
    })

    it('should LockKey work', async () => {
      await usersService.decoratorBufferByKey('testKey')
      expect(spy).toBeCalledWith(expect.any(Function), {
        resource: 'testKey',
        ttl: 1000000
      })
    })
  })
})
