# QuickStart

## 初始化
我们提供了一个脚手架模板，使用 klg-init 工具来初始化项目，如果没有 klg-init, 请先安装

```bash
npm i klg-init -g
```

创建项目

```bash
$ mkdir nest-example && cd nest-example
$ klg-init . --type=nest
$ npm i
```

## 启动项目

```bash
# development watch mode
$ npm run start:dev

# production mode
$ npm run start
```

open http://localhost:3000

## 测试Test


### 单元测试

```bash
$ npm run test
```

### e2e 测试
e2e 测试依赖 mongodb，开始之前请修改 config/test.js 里的 mongodb uri

```bash
$ npm run test
```

### 测试覆盖率(TODO)

```bash
# test coverage
$ npm run test:cov
```



