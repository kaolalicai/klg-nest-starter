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

### Git hooks
安装 husky 这个工具

```shell script
npm run i husky -D
```

接着在package.json定义husky的配置：

```js
"husky": {
   "hooks": {
      "pre-commit": "npm run format"
    }
}
```
我们在git的hook的阶段来执行相应的命令，比如上述的例子是在pre-commit这个hook也就是在提交之前进行lint的检测。

## Check commit message

我们将使用  [commitlint](https://github.com/conventional-changelog/commitlint) 来帮助我们检查 commit message。

安装对应的包：
```bash
npm install @commitlint/cli @commitlint/config-conventional -D
```

添加配置文件
> commitlint.config.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      "feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"
    ]],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
}
```

接着在package.json 新增 husky的配置：

```js
"husky": {
   "hooks": {
      "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS"
    }
}
```

这样就完成配置，当我们 commit 的时候，commitlint 就会帮我们完成格式校验。

一个正常的 commit message 看起来是这样的：

> type(scope?): subject  #scope is optional

或者这样：

> fix(server): send cors headers

> feat(blog): add comment section

> docs: add comment section

不符合规则的 commit 将会被 block

[完整项目示例](https://github.com/kaolalicai/klg-nest-starter/tree/master/sample/hello-world)

