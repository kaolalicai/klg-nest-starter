---
sidebarDepth: 2
---

## Redis
我们将会对三种基于 Redis 的应用场景提供集成方案
- key value store
- redlock 分布式锁
- cache 分布式缓存

完整的使用示例项目见本项目 sample/redis-redlock-cache

### Redis Store
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

## RabbitMQ(TODO)

TODO

## Keycloak SSO 认证和授权
Keycloak是一种面向现代应用程序和服务的开源的IAM(身份识别与访问管理)解决方案。

这里将介绍如何在 Nest 中接入 Keycloak.

在开始之前，请阅读官方的 Node.js [接入文档](https://github.com/keycloak/keycloak-nodejs-connect)，重点看
https://github.com/keycloak/keycloak-nodejs-connect/blob/master/example/index.js

在对官方 demo 有了大致认识之后，就可以开始准备接入了

初始化 Keycloak：
> src/keycloak.ts

```ts
import * as KeycloakConnect from 'keycloak-connect'
import * as session from 'express-session'
import {INestApplication} from '@nestjs/common'

var memoryStore = new session.MemoryStore()

// keycloak 服务的配置文件，可以在 keycloak 后台中导出
const keycloak: any = new KeycloakConnect(
  {
    store: memoryStore
  },
  {
    'realm': 'nodejs-example',
    'realm-public-key': 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrVrCuTtArbgaZzL1hvh0xtL5mc7o0NqPVnYXkLvgcwiC3BjLGw1tGEGoJaXDuSaRllobm53JBhjx33UNv+5z/UMG4kytBWxheNVKnL6GgqlNabMaFfPLPCF8kAgKnsi79NMo+n6KnSY8YeUmec/p2vjO2NjsSAVcWEQMVhJ31LwIDAQAB',
    'auth-server-url': 'http://10.10.21.4:8080/auth',
    'ssl-required': 'external',
    'resource': 'nodejs-connect',
    'public-client': true
  } as any)

export function registerKeycloak (app: INestApplication) {
  app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }))

  /**
   * 注册 logout 中间件
   * 请求 logout 即可退出中间件
   */
  app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/'
  }))

  /**
   * 默认拦截所有接口
   */
  app.use(keycloak.protect())
}

export {keycloak, session, memoryStore}

```

keycloak 需要 session store 来存储上下文，而且需要定义好 logout 的接口，而且这里默认拦截了所有接口，
keycloak 会检验用户是否登录，如果没登陆将会跳转到 keycloak 登陆页面。

然后在注册到 express 中

> main.ts

```ts
async function bootstrap () {
  const app = await NestFactory.create(ApplicationModule)
  registerKeycloak(app)
  await app.listen(process.env.PORT || 3000)
  console.log(
    `Application(${process.env.NODE_ENV}) is running on: ${await app.getUrl()}`
  )
}

bootstrap()
```

这样，keycloak 的拦截就能生效了，完成了认证效果。

接下来将如何授权，这里采用最简单的模式，基于角色的授权模式。
为每一个接口定义可以访问的角色：

> src/app.module.ts

```ts
export class ApplicationModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(keycloak.protect('realm:admin'))
      .forRoutes({ path: '/users/protect', method: RequestMethod.GET })
    consumer
      .apply(keycloak.protect('realm:user'))
      .forRoutes({ path: '/users/', method: RequestMethod.GET })
  }
}
```

上述配置的意思是：
- get /users/protect 接口只允许 admin 这个角色访问（realm 级别的角色)
- get /users/ 接口只允许 user 这个角色访问

如果一个接口允许多个角色访问，可以这样定义
```ts
consumer
      .apply(keycloak.protect(function pants(token, request) {
        return token.hasRole( 'realm:nicepants') || token.hasRole( 'mr-fancypants');
      }))
      .forRoutes({ path: '/users/', method: RequestMethod.GET })
```

如果无法理解这个配置，请仔细阅读：
- [Nest 中间件](https://docs.nestjs.cn/7/middlewares)
- [keycloak.protect](https://github.com/keycloak/keycloak-nodejs-connect/blob/c695149834651459f06945bd40eb8d8465fef541/keycloak.js#L187)

两份文档

如果需要获取当前登陆用户的信息，可以这样做：
> src/users/users.controller.ts
```ts
@Get('/protect')
async protect (@Req() req: Request): Promise<string> {
    let userInfo = (req as any).kauth.grant.access_token.content
    console.log('userInfo', userInfo)
    return 'protect info'
}
```

在 Controller 中通过 request 对象获取即可

最后, 完整的项目例子请看本项目 `sample/nest-auth`

**问题**
Q1:前后端分离的项目中，如果前端页面没有用 express 来承载，要如何实现登陆跳转？

A: 后端接入 Keycloak，前端项目使用 ajax 请求后端，检测到 302 跳转请求时完成页面跳转。

Q2:Keycloak 的登陆状态是是用 Cookie 来保存的，Native 端如何接入？

A: Native 模拟 browser 跳转到 H5 页面登陆，保存 cookie，后续的请求中都要带上 cookie 即可


  
