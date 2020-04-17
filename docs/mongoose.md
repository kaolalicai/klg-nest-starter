---
sidebarDepth: 2
---

## TypeORM

[TypeORM](https://typeorm.io/#/) 是个优秀的 ORM 框架，快可以比肩 JPA 了，但是他们俩的共同问题是，
他们第一适配的是 SQL 类数据库，对 MongoDB 的适配马马虎虎。

同时考虑到，团队之前一直在使用 Mongoose ，继续使用熟悉的 Mongoose 对我们来说是个更好的选择。

## Nest 的 Mongoose
Nest 在MongoDB 的使用上有两篇文档：
[Mongo](https://docs.nestjs.com/techniques/mongodb)
[Mongoose](https://docs.nestjs.com/recipes/mongodb)

效果嘛，挺糟糕的，老问题，mongoose 的 Schema 和 Interface 定义是分离的，要写很多重复代码

## Nest with Typegoose
Typegoose 可以帮我们使用 Class 来定义一个 Model，社区中也已经有人做好了 [Nest 和 Typegoose 的适配](https://github.com/kpfromer/nestjs-typegoose)
在这个基础上，我们在结合 config，可以非常简单的完成配置。

在 config 中配置好 mongodb 的链接，支持多个 DB
```js
module.exports = {
  port: process.env.PORT || 3000,
  mongodb: {
    debug: true,
    connections: [
      {
        name: 'core',
        url: 'mongodb://localhost:57017/core',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      },
      {
        name: 'app',
        url: 'mongodb://localhost:57017/app',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      }
    ]
  }
}
```

然后在 APPModule 中初始化 Typegoose

```ts
import {Module} from '@nestjs/common'
import {UsersModule} from './users/users.module'
import {TypegooseModuleBuilder} from '@klg/mongoose'

@Module({
  imports: [
    TypegooseModuleBuilder.forRoot(),
    UsersModule
  ]
})
export class ApplicationModule {
}
```

TypegooseModuleBuilder 是我们写好的一个工具类, 作用读取 config 的 uri 然后初始化 Typegoose。

> **注意** TypegooseModuleBuilder 在 @klg/mongoose 中引入
