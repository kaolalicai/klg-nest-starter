我们会把常用的工具集放入 npm 包中，方便集中维护, 所有工具集都会放入 @kalengo 这个域中

@kalengo/utils 收集了 Kalengo 后端开发常用的工具类，目前有

## DateUtil
日期计算，节假日

TODO: 兼容多时区

## NumberUtil
主要处理 0.1 + 0.2 = 0.30000000000000004 问题

## Logger
logger 工具，小巧玲珑，基于开源日志工具 [tracer](https://github.com/baryon/tracer), 这个库的优势是可以打印 log 发生的文件位置。

接下来介绍一些常用配置，配置写在 config/xxx.js 中

配置日志级别，具体有那些级别请看 tracer 文档
```ts
log: {
    level: 'info'
}
```

把日志写入文件中

```ts
log: {
    level: 'info',
    root: './logs',
    allLogsFileName: 'mongoose'
}
```
root 就是文件保存的路径。 allLogsFileName 是文件名。 日志默认会按日分割。

如果你需要自定义的 logger，直接用新的 config 构造一个 logger 就行。

```ts
import { LoggerFactory } from '@akajs/utils'
const logger = LoggerFactory(config)

export {logger}
```
config 写入你自定义的配置

## StringUtil(TODO)

