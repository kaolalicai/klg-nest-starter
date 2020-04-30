事件处理是我们开发中常用的模块，不过 Nest 没有官方支持，
这里推荐大家使用 [nest-event](https://github.com/javascript-dragons/nest-event) 这个开源项目.

该项目的特点:

1. 抛出事件
```ts
import { NestEventEmitter } from './nest-event';

@Controller('user')
export class UserController {
  constructor(
    private readonly nestEventEmitter: NestEventEmitter,
    ) {}

  @Post('signup')
  signup() {
    // ...
    this.nestEventEmitter.emit('user-created', user);
  }
}
```
通过注入获得 eventEmitter

2. 响应事件
```ts
import { Injectable } from '@nestjs/common';
import { On } from './nest-event';
import { User } from './interfaces';

@Injectable()
export class EmailService {

  @On('user-created')
  onUserCreated(user: User){
    // send verification email
  }
}
```
使用注解来响应事件，简洁明了

3. 还支持给 event 加上类型

```ts
// define your events
interface Events {
   request: (request: Request, response: Response) => void;
   done: void;
}
this.nestEventEmitter.strictEmitter<Events>().emit('done');
```

如果 emit 的参数不符合类型定义，将会报错, 具体见 [StrictEventEmitter](https://github.com/bterlson/strict-event-emitter-types)
