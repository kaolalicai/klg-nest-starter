---
sidebarDepth: 2
---

## 繁琐的 Nest Configuration
Nest 的 Configuration 是异步的，这种设计导致在初始化 DB 连接的写法将会很繁琐

```ts
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.getString('MONGODB_URI'),
  }),
  inject: [ConfigService],
});
```

## 简单的 Config
基于我们的之前的开发经验， [config](https://www.npmjs.com/package/config) 这个包提供的配置功能已经足够好用，
所以在本脚手架中，我们将使用 config 来实现应用配置

```ts
MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: config.get('mongodb.uri')
  }),
});
```
