如何自定义注解呢？


## Controller 层
如果是在路由层面的注解，请看官方文档 [自定义路由参数装饰器](https://docs.nestjs.cn/7/customdecorators)

## Service 
在 Service 层面做自定义注解，最大的问题是如何在注解里使用其他 Service 呢？

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

2. 通过 Inject 方法(推荐)

```ts
import { Inject } from '@nestjs/common';
export function yourDecorator() {
  const injectYourService = Inject(YourServiceClass);

  return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    // this is equivalent to have a constructor like constructor(yourservice: YourServiceClass)
    // note that this will injected to the instance, while your decorator runs for the class constructor
    injectYourService(target, 'yourservice');

    // do something in you decorator

    // we use a ref here so we can type it
    const yourservice: YourServiceClass = this.yourservice;
    yourservice.someMethod(someParam);
  };
}
```

