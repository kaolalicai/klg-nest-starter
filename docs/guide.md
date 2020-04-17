---
sidebarDepth: 2
---

## Web
接下来我们将从一个请求开始说起，如何一步一步构架一个 Web 服务

## 先理解 Nest 的 Module
Nest 默认提供了 Module 模块的概念，在继续本教程之前，请务必理解 Nest 的 [Module](https://docs.nestjs.cn/7/modules)
其核心概念有：

- providers	由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
- controllers	必须创建的一组控制器
- imports	导入模块的列表，这些模块导出了此模块中所需提供者
- exports	由本模块提供并应在其他模块中可用的提供者的子集。

假设一个场景，我们系统里定义两个 Module，UserModule 和 OrderModule.
在 UserModule 中我们定义了一个 UsersService
> users.module.ts
```ts
@Module({
  imports: [
    TypegooseModule.forFeature([User], 'core'),
  ],
  controllers: [UsersController],
  providers: [UsersService]，
  exports: [UsersService]
})
export class UsersModule {
}
```

如果我们要在 OrderModule 里使用 User 这个 UsersService 应该如何做呢？
前提是 UserModule 里必须把 UsersService 导出，然后在  OrderModule 里导入

> order.module.ts
```ts
@Module({
  imports: [
    UserModule,
    TypegooseModule.forFeature([Order], 'core'),
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {
}
```
然后在 OrderService 中使用

TODO

## 定义一个路由
Nest 使用注解式路由

> cats.controller.ts

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

请求参数则通过 @Query @Body 等方式获取，具体见 [Nest文档](https://docs.nestjs.cn/7/controllers)


## 参数校验 DTO
在 Nest 框架中，最好使用 DTO 对象来完成参数的校验

## Request Log
Nest 默认不提供 Request Log 的中间件，我们可以使用开源的 express 中间件 morgan，在 main.ts 中挂载即可

```ts
import {NestFactory} from '@nestjs/core'
import * as morgan from 'morgan'
import {ApplicationModule} from './app.module'

async function bootstrap () {
  const app = await NestFactory.create(ApplicationModule)
  // request log
  app.use(morgan('tiny'))
  await app.listen(process.env.PORT || 3000)
  console.log(`Application(${ process.env.NODE_ENV }) is running on: ${ await app.getUrl() }`)
}

```

## Response Format
实际业务中，我们需要统一接口的返回值，Nest 默认不提供此类中间件，我们可以自己实现一个，如何编写中间件，请看 [Nest文档](https://docs.nestjs.cn/7/middlewares)

> transform.interceptor.ts

```ts
import {Injectable, NestInterceptor, CallHandler, ExecutionContext} from '@nestjs/common'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs'

interface Response<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept (context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          data,
          code: 0,
          message: 'success'
        }
      })
    )
  }
}
```

中间件写好了之后，在 main.ts 中挂载即可

```ts
app.useGlobalInterceptors(new TransformInterceptor())
```

**注意** 此类通用的中间件，我们会放入 @klg/web 包中

## 统一的异常处理
详细的描述见 [Nest文档](https://docs.nestjs.cn/7/exceptionfilters)
具体的落地实现在 @klg/web 包
