# Keycloak SSO 认证和授权

Keycloak是一种面向现代应用程序和服务的开源的IAM(身份识别与访问管理)解决方案。

这里将介绍如何在 Nest 中接入 Keycloak.

## 不好用的官方适配器

Keycloak 官方提供了一个 Node 的适配器 [keycloak-nodejs-connect](https://github.com/keycloak/keycloak-nodejs-connect)

这个适配器在我们的试用过程中，感觉设计非常不合理，这个主要是定位问题。

Keycloak 的设计中，Node 是只做渲染层的，而且登陆功能也必须做在渲染层面，
所以 keycloak-nodejs-connect 就是为前端服务适配的，完全达不到 Java 适配器的水准。


当一个 Node后端服务要对接 Keycloak 的时候会被官方的适配器搞死，可怜的 Node 再次被忽视了。

## Kalengo 定制

所以我们最终决定对 keycloak-nodejs-connect 做二次开发，以 Node 后端标准来设计，
我们需要考虑以下情况：

- Node 服务是无状态的，所以不会有 session，所以 token 不会保存在 cookie 中，而是前端负责保存
- 实现最基础的基于角色的访问控制（RBAC）
- Native APP 自定义登陆页面，后端提供登陆接口

根据上述需求，我们重新设计了适配器，放在 @kalengo/keycloak 中, 
该适配器参考了 [nest-keycloak-connect](https://github.com/ferrerojosh/nest-keycloak-connect),

接下来我们会讲解如何接入我们的适配器，完整的项目例子见 [nest-keycloak](https://github.com/kaolalicai/klg-nest-starter/tree/master/sample/nest-keycloak)

## 配置 Keycloak Client 
在开始之前，你需要对 Keycloak 的 Client 有个基础的认识，Client 代表接入方。

请自行部署 Keycloak，可以使用  Docker 非常方便。

在 Keycloak 后台新建一个 Client，有几点设置要注意，在 Client Settings 中：

- Client Protocal 设置为 openid-connect
- Access Type 设置为 confidential (后续支持自定义资源)
- Direct Access Grants Enabled 设置为 **On** (支持接口登陆)

Advanced Settings 下面

- Access Token Lifespan 设置为 3 hours (默认时间有点短)

Authentication Flow Overrides 下面

- Browser Flow 设置为 **browser**
- Direct Grant Flow  设置为 **direct grant**

完成上述配置后，点击 Client 菜单右侧 **Installation**，Format Option 选择 JSON，
这段 JSON 就是我们应用需要的配置信息。

## 初始化 Keycloak
把上述 JSON 放入配置文件中

> config/dev.js

```js
module.exports = {
  port: process.env.PORT || 3000,
  schedule: true,
  keycloak: {
    realm: 'nodejs-example',
    'auth-server-url': 'http://keycloak.sso.dev.smart2.cn/auth/',
    'ssl-required': 'external',
    resource: 'nodejs-apiserver',
    'verify-token-audience': false,
    credentials: {
      secret: 'a6cdcf7c-6e87-4e6d-9e45-4bd6c7b9a0d6'
    },
    'confidential-port': 0,
    'policy-enforcer': {}
  }
}
```

**注意**：要把 `verify-token-audience` 改为 false (我也不知道为什么)


## 全局引入
初始化 Keycloak, 在 APP Module 中全局引入我们写好的包

> src/app.module.ts

```ts
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { UsersModule } from './users/users.module'
import { KeycloakConnectModule, AuthGuard, RolesGuard } from '@kalengo/keycloak'

@Module({
  imports: [KeycloakConnectModule.forRoot({}), UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class ApplicationModule {}
```

KeycloakConnectModule 包装了官方的适配器 keycloak-nodejs-connect

AuthGuard 负责校验用户的登陆状态，如果用户的 http 请求没有携带 token 或者 token 超时，
该中间件会拦截请求并返回 401 Unauthorized ，
这个时候前端应该跳转到自定义的 login 页面

默认是拦截了所有接口的(login)，如果你需要给其他接口加上白名单，请期待下一个版本实现。

## 按需引入
全局引入 AuthGuard 会给 E2E 测试带来麻烦，因为 Nest 并不支持覆盖上述写法的全局引入，这样测试就会被授权问题卡住。

为了解决测试问题，可以考虑在 Controller 层按需引入 AuthGuard

```ts
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
export class UsersController {
}
```
**注意**：因为 RolesGuard 依赖 AuthGuard 的 token，所以 AuthGuard 必须写在 RolesGuard 下面，顺序不能乱


## 授权

角色控制则通过 RolesGuard 来实现，我们将会在 Controller 来声明哪些接口可以被哪些角色访问

> src/users/users.controller.ts

```ts
@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name)

  constructor(
    private readonly usersService: UsersService,
    @Inject(KEYCLOAK_INSTANCE)
    private readonly keycloak: Keycloak
  ) {}

  @Get()
  @Roles('realm:admin')
  async findAll(): Promise<number[]> {
    return this.usersService.findAll()
  }

  @Get('/info')
  @Roles('realm:user', 'realm:none')
  async protect(@Req() req: Request): Promise<string> {
    const userInfo = (req as any).user
    console.log('userInfo', userInfo)
    return 'protect info'
  }
}
```

上述配置的意思是：
- get /users/info 接口允许 user 或 none 这两个角色访问（realm 级别的角色)
- get /users/ 接口只允许 admin 这个角色访问

注意角色必须带上 'realm:' 这个固定前缀，
表示是 realm 级别的角色，
如果是 Client 级别的角色应该是 'client-id:roe' 这种格式

如果用户没有对应权限，请求接口时会得到 406 Not Acceptable 错误

RolesGuard 底层依赖于官方适配器的 keycloak.protect ，更多信息建议阅读：
- [Nest 中间件](https://docs.nestjs.cn/7/middlewares)
- [keycloak.protect](https://github.com/keycloak/keycloak-nodejs-connect/blob/c695149834651459f06945bd40eb8d8465fef541/keycloak.js#L187)

两份文档

## 获取用户信息

如果需要获取当前登陆用户的信息，可以这样做：
> src/users/users.controller.ts
```ts
@Get('/info')
async info (@Req() req: Request): Promise<string> {
    let userInfo = (req as any).user
    console.log('userInfo', userInfo)
    return 'protect info'
}
```

在 Controller 中通过 request 对象获取即可，
AuthGuard 已经把 token(jwt) 信息解密出来并放到 request.user 中


## 自定义登陆接口
因为很多项目是前后端分离加上有些前端是 native 的原因，我们需要一个自定义的登陆接口。

```ts
  @Get('/login')
  async login(): Promise<string | { token: string }> {
    const username = 'user'
    const password = 'password'
    try {
      const grant = await this.keycloak.grantManager.obtainDirectly(
        username,
        password
      )
      // console.info('grant', grant)
      const token: string = _.get(grant, 'access_token.token')
      this.logger.verbose('access_token', token)
      return { token }
    } catch (e) {
      this.logger.verbose('login fail', e)
      return 'login fail'
    }
  }
```

这里为了方便测试写死了 username， password，各位实际用的时候改成 post 接口由前端传参即可

前端只要先请求这个接口即可完成登陆，返回值中包含了 token，前端需要保存这个 token，
后续请求后端接口的时候都带上这个 token 即可。

具体做法：

> headers: { Authorization: `Bearer ${token}` }

在请求头里设置一个 headers，Key 是 Authorization，值是 `Bearer ${token}`

## 自动授权(TODO)
Keycloak 管理后台支持定义各种资源和权限，如果要实现管理后台修改权限后，应用自动实现授权，我们还有很多工作要做。

## 使用 Keycloak 自带的登陆页面(TODO)
Keycloak 支持用户初始化后首次登陆修改密码，验证邮箱等操作，
这样自定义登陆接口就不够用了，最好是使用 Keycloak 自带的登陆页面。

## 测试
这里测试有两种方式，连接 Keycloak 和 不 Mock Keycloak，分别介绍一下。

连接 Keycloak 测试

> test/main.ts
```ts
export async function bootstrapWithAuth() {
  // init nestjs
  const testModule = await Test.createTestingModule({
    imports: [ApplicationModule]
  }).compile()
  const app = testModule.createNestApplication()
  appSettings(app)
  await app.init()
  const request = supertest(app.getHttpServer())
  return { app, request, testModule }
}
```
不对 AuthGuard 做 mock 处理，在测试文件中引入

> test/users/users-auth.e2e-spec.ts
```ts
import { bootstrapWithAuth } from '../main'
import * as supertest from 'supertest'

describe('users-auth.e2e-spec.ts', () => {
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(async function () {
    const res = await bootstrapWithAuth()
    request = res.request
  })

  it('not login get 401 ', () => {
    return request.get('/users/hello').expect(401)
  })
})

```
这样测试的时候就会请求 Keycloak 做权限验证。

- - -
Mock Keycloak 测试


> test/main.ts
```ts
export async function bootstrapWithAuth() {
  // init nestjs
  const testModule = await Test.createTestingModule({
    imports: [ApplicationModule]
  })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile()
  const app = testModule.createNestApplication()
  appSettings(app)
  await app.init()
  const request = supertest(app.getHttpServer())
  return { app, request, testModule }
}
```
AuthGuard 和 RolesGuard 都执行了 overrideGuard，默认打开所有权限。

**再次强调，overrideGuard 不支持全局引入的 AuthGuard，你需要把 AuthGuard 在 Controller 层引入 overrideGuard 才有效，具体做法见上文**

> test/users/users-mock-auth.e2e-spec.ts
```ts
import { request } from '../test-helper'

describe('users-mock-auth.e2e-spec.ts', () => {
  it('not login is ok ', () => {
    return request.get('/users/hello').expect(200)
  })

  it('get user is ok', () => {
    return request.get('/users/info').expect(200)
  })

  it('get all user is ok', () => {
    return request.get('/users/').expect(200)
  })
})


```
之后的测试就畅通无阻了

## 总结
就这样，引入一个包，设置注解后就可以轻松实现角色访问控制了。

完整的项目例子见 [nest-keycloak](https://github.com/kaolalicai/klg-nest-starter/tree/master/sample/nest-keycloak)
