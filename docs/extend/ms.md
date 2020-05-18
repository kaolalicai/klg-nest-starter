Nest 官方文档有对[微服务](https://docs.nestjs.cn/7/microservices)有详细的描述

实际上 Nest 所提供的并未全功能的微服务，应该说只是提供了**跨服务调用机制**

如果我们需要解决更多的微服务问题，例如服务注册与发现，熔断限流，分布式追踪等，需要自己采用第三方框架来实现。

接下来介绍一下，Nest 微服务提供的各种传输层方案的适用场景

- TCP: 最简单的模式, 适合开发模式，不好做负载均衡
- Redis: 不能保证消息一定会被消费
- MQTT: 适合高延迟场景，例如智能家居
- NATS: 简单，高性能，国内社区不活跃
- RabbitMQ: 稳，适合对一致性要求高的场景，例如核心交易业务
- kafka: 快，适合大量数据传输的场景，例如日志上传
- gRPC: 对 TCP 协议的升级，跨语言，同样需要额外做负载均衡，适合 k8s 环境

请各位根据自己业务的实际情况选择传输层, 注意 [混合应用](https://docs.nestjs.cn/7/faq?id=%e6%b7%b7%e5%90%88%e5%ba%94%e7%94%a8) 的写法，文档藏得比较深 

微服务的完整例子见：

[Provider 提供者](https://github.com/kaolalicai/klg-nest-starter/tree/master/sample/nest-ms-provider)

[Consumer 消费者](https://github.com/kaolalicai/klg-nest-starter/tree/master/sample/nest-ms-consumer)




