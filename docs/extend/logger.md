Logger 建议使用 Nest 自带的 Logger 系统

在 全局或者 static 域中使用 Logger

```ts
import { Logger } from '@nestjs/common'

Logger.debug('hello')
Logger.info('hello')

```

在 class 中使用 Logger

```ts
@Injectable()
export class RolesGuard implements CanActivate {
  logger = new Logger(RolesGuard.name)
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('hello')
  }
}
```

更多细节请看 Nest 官方文档 [日志](https://docs.nestjs.cn/7/techniques?id=%e6%97%a5%e5%bf%97)

## 自定义日志输出(TODO)

请阅读官方文档，有给出自定义教程

## 日志写入文件并按日分割(TODO)

TODO
