## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Nest 脚手架，在开始使用之前，你需要对 Nest 有个基本的认识，特别是 Module 的概念。

本脚手架是 Kalengo 适配版本，针对 Kalengo 的实际需求对 Nest 做了适配.

修改项目：
- 测试使用 mocha
- e2e 测试不会 mock db
- e2e 测试支持 mockjs，准备测试更方便
- 使用 typegoose 并支持多 db
- config 简化，直接使用 config 包
- 统一的错误处理
- 新增注解 @Parameters 把所有参数汇总到一个对象中
- response format
- request log
- 使用 tslint 而不是 eslint，Standard 风格
- 提供常用工具的实现 DateUtil NumberUtil
- 开启 typescript 的 strict mode
- 提供 crud 实现

详细内容见文档：

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
