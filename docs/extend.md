
## Redis
我们将会对三种基于 Redis 的应用场景提供集成方案
- key value store
- redlock 分布式锁
- cache 分布式缓存

[完整项目示例](https://github.com/kaolalicai/klg-nest-starter/tree/master/sample/redis-redlock-cache) 

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

### 初始化
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

### 授权
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

### 获取用户信息

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

### 自定义登陆接口
因为很多项目是前后端分离加上有些前端是 native 的原因，我们需要一个自定义的登陆接口。
在开始写接口之前，我们要修改一下 client 的配置，让它支持API 登陆。
打开 Keycloak 管理后台，找到你的 Client，在 Settings 中：

- Direct Access Grants Enabled 设置为 **On**

Authentication Flow Overrides 下面

- Browser Flow 设置为 **browser**
- Direct Grant Flow  设置为 **direct grant**

完成配置之后，新增一个登陆接口：
```ts
@Get('/login')
  async login (@Req() req: Request, @Res() res: Response): Promise<void> {
    let username = 'user'
    let password = 'password2'
    try{
      let grant = await keycloak.grantManager.obtainDirectly(username, password)
      console.info('grant', grant)
      keycloak.storeGrant(grant, req, res)
      let access_token = _.get(grant, 'access_token.token')
      console.info('access_token', access_token)
      res.json({code: 0, message: 'success', access_token})
    }catch (e) {
      console.info('login fail ', e)
      res.json({ code: 1, message: 'login fail' })
    }
  }
```

这里写死了 username， password，实际用的时候改成前端传参即可
通过 API 授权后，会获得一个 grant，里面保存了 token，再把这个 grant store 到 session 中即可。
前端只要先请求这个接口即可完成登陆。

如果前端是浏览器，那么 token 将会被写入 cookie 中，前端不需要额外处理。

如果前端是 Native APP 在返回值中能获得一个 access_token，后续请求后端接口的时候都带上这个 access_token 即可。

具体做法：

> headers: { Authorization: `Bearer ${access_token}` }

在请求头里设置一个 headers，Key 是 Authorization，值是 `Bearer ${access_token}`

### 总结

最后, 完整的项目例子请看**本项目** `sample/nest-auth`

**问题**

Q1:前后端分离的项目中，如果前端页面没有用 express 来承载，要如何实现登陆跳转？

A1: 使用自定义登陆接口

A2: 后端接入 Keycloak，前端项目使用 ajax 请求后端，检测到 302 跳转请求时完成页面跳转。

Q2:Keycloak 的登陆状态是是用 Cookie 来保存的，Native 端如何接入？

A1: 使用自定义登陆接口

A2: Native 模拟 browser 跳转到 H5 页面登陆，保存 cookie，后续的请求中都要带上 cookie 即可

Q3: 使用了 API 登陆后，如何不让页面自动跳转？

A: 这个问题比较复杂，首先要理解 sso 的意义，在最前端登陆，后续的服务都不需要登陆。

其次，Keycloak 的 client 有多种类型

- public：一般是指前端资源，通常服务页面渲染和提供登陆接口
- bearer-only： 只传递 token，一般是指中台服务，做资源聚合
- confidential：资源服务器，指后端服务

但是很多时候我们的服务实现了三种 client 的功能，这样的话就比较复杂了。

解决方案1 ：
服务内同时对接多个 client：
- public client 提供登陆接口；
- bearer-only 的 client 负责授权，检查接口是否能被角色访问；

解决方案2：
- 把登陆功能独立为一个服务，提供登陆接口和登陆页面两种登陆方式
- 把业务服务的client 设置为 bearer-only，用户访问未授权资源就不会自动跳转，而是得到 code 403 Access denied




  
