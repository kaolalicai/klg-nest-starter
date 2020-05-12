import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { TransformInterceptor } from '@kalengo/web'

async function bootstrap () {
  const app = await NestFactory.create(ApplicationModule)

  app.setGlobalPrefix('api/v1')

  // 错误处理和返回值format
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(process.env.PORT || 3000)
  console.log(
    `Application(${process.env.NODE_ENV}) is running on: ${await app.getUrl()}`
  )
}

bootstrap()
