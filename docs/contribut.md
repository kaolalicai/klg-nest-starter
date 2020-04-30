---
sidebarDepth: 2
---

本脚手架包括三大内容：
- 通用的npm 模块 packages
- 项目示例 sample
- klg-init 模板

## 开发 packages
为了方便用户升级，脚手架提供的特性大部分都会通过 @kalengo/xxx 这样的 npm 模块实现，用户只要模块版本就可以享受新功能。

因为是多模块开发，所以使用 [lerna](https://github.com/lerna/lerna) 这个库来帮忙管理和发布模块。

模块都存放在 packages 目录中，lerna 可以有效地帮你处理好模块之间的引入关系。

## 单元测试(TODO)
每个 packages 需要编写单元测试，保证稳定性，执行方法：
```bash
npm run test
```


## 集成测试
所有示例项目都存放在 sample 目录中，我们的每次修改都要保证示例的测试能够通过。

首先，把修改后的 packages build 到 sample 中
```bash
npm run build
```

然后执行集成测试, 这个命令会进入每一个 sample 并执行 `npm run test:e2e`
```bash
bash run-tests
```

## 发布 packages
以上测试都通过后，就可以执行发布

```bash
npm run publish
```

选择本次发布对应的版本，lerna 会帮你搞定发布流程。


## 验证 packages
为了验证 packages 是否可用，我们可以执行以下命令测试

先执行 `bash upgrade-packages.sh` 更新 sample 下的 @Kalengo 相关的包

再执行 `bash run-tests` 进行验证测试

## 发布脚手架模板
我们使用 klg-init 来生成脚手架，该脚手架需要一个模板。

模板存放位置 template/

默认将 hello-world sample 转为模板，把 hello-world 项目更新到最新，使用最新的 npm 包之后。

```bash
gulp move:template
```

测试模板
```bash
cd template
npm run test
```

该命令做了以下事情：

- 将模板初始化为项目
- npm install
- npm test

注意：测试需要连接 mongodb, 修改 template/config/test.js 里的DB配置即可

测试通过就可以发布模板，执行 template/package.json 里的命令
```bash
npm run publish
```

项目模板将会以 npm 模块的形式发布出去, 模块名是 klg-nest-starter ，klg-init 会自动检测到最新模板。

注意：cnpm 同步 npm 仓库会有时延，你可以选择手动同步, 直接访问 https://npm.taobao.org/sync/klg-nest-starter 触发同步

## 更新文档

本项目的文档使用 [vuepress](https://vuepress.vuejs.org/zh/) , Vue 驱动的静态网站生成器。
使用 Markdown 编写，排版也非常简单，一键发布到 Github Pages。

执行一下命令，会打开本地文档预览，还会自动刷新。

```bash
npm run docs:dev
```

文档编写完成后，执行项目根目录的发布脚本

```bash
bash deploy_doc.sh
```
文档就更新到 Github Pages 了。
