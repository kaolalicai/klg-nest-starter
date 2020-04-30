如何自定义注解呢？


## Controller 层
如果是在路由层面的注解，请看官方文档 [自定义路由参数装饰器](https://docs.nestjs.cn/7/customdecorators)

## Service 
在 Service 层面做自定义注解，最大的问题是如何在注解里使用其他 Service 呢？

首先，我们要理解 Nest 加载的过程，注解是在程序启动时就会被加载的，而 Service 实例则需要 Nest 的容器加载完毕后，再注入到对应的 Service 中。

也就是说，在注解的加载阶段，你是无法获得 Service 实例的，那还能怎么办呢？

StackOverFlow 网友和你有同样的疑问 [in-nest-js-how-to-get-a-service-instance-inside-a-decorator](https://stackoverflow.com/questions/52106406/in-nest-js-how-to-get-a-service-instance-inside-a-decorator)

在这个问题中，我们可以得到两个解决方案。

1. 在 Service A 引入 Service B，然后在注解里使用 Service B

```ts
@Injectable()
export class CatsService {
  constructor(public myService: MyService){}

  @CustomDecorator()
  foo(){}
}

export const CustomDecorator = (): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {

    const originalMethod = descriptor.value;

    descriptor.value = function () {
      const serviceInstance = this;
      console.log(serviceInstance.myService);

    }

    return descriptor;
  }
};
```

这里就要求被 CustomDecorator 注解的 Service 必须引入 MyService，不然程序就会出错，
这是一种约定式的绑定，非常不靠谱，不推荐。

2. 注解只负责声明，实际的包装和注入在其他地方完成。
这里以实现一个 MQ Subscribe 订阅为例

注解只负责声明

```ts
export const Subscribe = (topic: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata<string, RabbitSubscriberMetadataConfiguration>(
      RABBITMQ_SUBSCRIBER,
      {
        topic,
        target: target.constructor.name,
        methodName: propertyKey,
        callback: descriptor.value,
      },
    )(target, propertyKey, descriptor);
  };
};
```
这里只登记了“哪个 Service 的哪个 function 需要 Subscribe”，存放在全局对象 Metadata 中

然后在 RabbitmqModule 的生命周期的初始化阶段，找到上述的登记信息，再执行订阅

```ts
@Module({
  imports: [RabbitmqChannelProvider],
  providers: [RabbitmqService, MetadataScanner, RabbitmqSubscriberExplorer],
  exports: [RabbitmqService],
})
export class RabbitmqModule implements OnModuleInit {
  constructor(
    private readonly explorer: RabbitmqSubscriberExplorer,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async onModuleInit() {
    // find everything marked with @Subscribe
    const subscribers = this.explorer.explore();
    // set up subscriptions
    for (const subscriber of subscribers) {
      await this.rabbitmqService.subscribe(
        subscriber.topic,
        subscriber.callback,
      );
    }
  }
}
```

通过这种方式，我们就不需要在注解 Subscribe 里引入 rabbitmqService 了。
