## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Nest 脚手架，在开始使用之前，你需要对 Nest 有个基本的认识，特别是 Module 的概念。

本脚手架是 Kalengo 适配版本，针对 Kalengo 的实际需求对 Nest 做了适配.

详细内容见文档： [Kalengo Nest Starter](https://kaolalicai.github.io/nest_doc/)

## 构建脚手架模板
我们使用 klg-init 来生成脚手架，该脚手架需要一个模板。

模板存放位置 template/

将 hello-world sample 转为模板

```bash
gulp move:template
```

测试模板
```bash
cd template
npm run test
```

该命令将会尝试将模板初始化为项目

然后执行
npm install
npm test

测试需要连接 mongodb, 修改 template/config/test.js 里的DB配置即可


## 构建工具包


