---
sidebarDepth: 2
---

## Lint : Eslint

TypeScript core team 在 2019 的时候宣称考虑到 eslint 比 tslint 有着更好的性能，将全面转用 eslint，不再更新 tslint。

所以我们也跟着转吧，所有配置都在脚手架中配好，默认在执行 `npm run test:e2e` 之前会执行一次 `npm run lint`

## Format : Prettier

而代码风格这里，将参考 Nest 的示例项目，使用 Prettier 统一 format.

如果你还不了解 Prettier，可以看看[这篇文章](https://zhuanlan.zhihu.com/p/81764012)

## 自动 Format 代码

### VS Code

上面提到的文章有提到如何安装插件，具体看文章

### Webstorm

在设置中找到 Prettier 的配置项，勾选 `Run on save for files` 即可

### Git hooks(TODO)
安装 husky 这个工具

```shell script
npm run i husky -D
```

接着在package.json定义husky的配置：

```js
"husky": {
   "hooks": {
      "pre-commit": "npm run lint"
    }
},
```
我们在git的hook的阶段来执行相应的命令，比如上述的例子是在pre-commit这个hook也就是在提交之前进行lint的检测。
