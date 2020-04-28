我们将会对三种基于 Redis 的应用场景提供集成方案
- key value store
- redlock 分布式锁
- cache 分布式缓存

[完整项目示例](https://github.com/kaolalicai/klg-nest-starter/tree/master/sample/redis-redlock-cache) 

## Redis Store
这里直接使用开源第三方 [nestjs-redis](https://github.com/kyknow/nestjs-redis) 的实现即可，
结合 config，做一层包装，
封装好的包是 @kalengo/redis

配置好 redis 属性
> config/default.js

```js
module.exports = {
  port: process.env.PORT || 3000,
  redis: {
    uri: process.env.REDIS_URI || 'redis://localhost:6379',
    prefix: process.env.REDIS_PREFIX || 'redis_'
  },
}
```
导入全局依赖
> app.module.ts

```ts
import {Module} from '@nestjs/common'
import {UsersModule} from './users/users.module'
import {RedisModuleBuilder, RedlockModule} from '@kalengo/redis'

@Module({
  imports: [
    RedisModuleBuilder.forRoot(),
    UsersModule
  ]
})
export class ApplicationModule {
}
```

RedisModuleBuilder.forRoot() 会读取 config 中 redis 的配置，然后初始化 nestjs-redis。

在 service 中使用
```ts
@Injectable()
export class UsersService {
  constructor (
    private readonly redisService: RedisService
  ) {
    // blank
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
```

nestjs-redis 默认支持同时连接多个 redis, 所以才会在使用之前要 getClient()。

TODO：后续可以考虑把 default client export 出来，直接 inject in to service 使用

## RedLock


我们将使用 [redlock](https://github.com/mike-marcacci/node-redlock) 这个库来实现分布式锁。

nestjs-redis 底层是基于 [ioredis](https://github.com/luin/ioredis) 这个库的，恰好 redlock 也支持 ioredis，
所以我们可以在 nestjs-redis 的基础上封装 redlock。

### 配置

redis uri 配置同上。

导入全局依赖
> app.module.ts

```ts
import {Module} from '@nestjs/common'
import {UsersModule} from './users/users.module'
import {RedlockModule} from '@kalengo/redis'

@Module({
  imports: [
    RedlockModule.forRoot(),
    UsersModule
  ]
})
export class ApplicationModule {
}
```

**注意**因为 RedlockModule 包含了 RedisModuleBuilder，所以这里就不用在 import RedisModuleBuilder 了。
导入的时候可以设置 BufferLock 重试锁的重试参数

```ts
RedlockModule.forRoot({
    retryCount: number // 最大重试次数
    retryDelay?: number // 重试间隔
})
```
默认重试10分钟，间隔0.4s

### 使用
在 service 中使用
```ts
@Injectable()
export class UsersService {
  constructor (
    private readonly redlockService: RedlockService,
    @Inject(BUFFER_LOCK)
    private readonly bufferLock: Redlock
  ) {
    // blank
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
}

```
要使用 redlock，可以通过注入 RedlockService。
我们默认提供了两种锁：
- bufferLock: 重试锁，碰到锁定会重试，重试参数在导入的时候设定，注意是非公平锁
- mutexLock: 排他锁，碰到锁定直接抛错。

你也可以直接 Inject 你需要的锁。

```ts
@Inject(BUFFER_LOCK) private readonly bufferLock: Redlock
```

为了帮助大家省去加锁和解锁的操作，我们还提供了一个 using wrapper，会自动检测异常，并做好自动解锁。

### 测试

> sample/redis-redlock-cache/test/users/users-redis.e2e-spec.ts

```ts
describe('users-redis.e2e-spec', () => {

  it('mutex', async () => {
    const results = await Promise.all([
      request.get('/users/mutex').expect(200).expect([ 1, 2, 3, 4, 5 ]),
      request.get('/users/mutex').expect(500), // 报错
      request.get('/users/mutex').expect(500) // 报错
    ])
  })

  it('buffer', async () => {
    const results = await Promise.all([
      request.get('/users/buffer').expect(200).expect([ 1, 2, 3, 4, 5 ]),
      request.get('/users/buffer').expect(200).expect([ 1, 2, 3, 4, 5 ]),
      request.get('/users/buffer').expect(200).expect([ 1, 2, 3, 4, 5 ])
    ])
  })
})
```
经过测试，两种锁都达到了预期

### 注解(TODO)
===暂未实现===

用 using 方法包装还是略显麻烦，我们提供了注解工具，可以帮助你快速给 function 上锁。

使用例子

```ts
@Injectable()
export class UsersService {
  constructor (
    private readonly redlockService: RedlockService) {
    // blank
  }

  @MutexLock('key1')
  async mutex () {
    return [1, 2, 3, 4, 5]
  }

  @BufferLock()
  async buffer (@LockKey('key')params:object) {
    return params
  }
}

```

还是要注入 RedlockService，
@MutexLock 只是帮我们自动给方法加上 using 而已。

lock key 可以直接指定一个字符串值

`@MutexLock('key1')`


也可以从 arguments 中获取,这个的意思是在 params 参数中取出 key 字段作为 lock key

`@LockKey('key')params: object`

还可以直接指定一个 string 类型的参数作为 lock key

`@LockKey()name: string`

## Cache(TODO)
