import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { appSettings } from './settings'
import { ZeebeServer } from '@payk/nestjs-zeebe'

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule)

  appSettings(app)

  const microservice = app.connectMicroservice({
    strategy: app.get(ZeebeServer)
  })

  await app.startAllMicroservicesAsync()

  await app.listen(process.env.PORT || 3000)
  console.log(
    `Application(${process.env.NODE_ENV}) is running on: ${await app.getUrl()}`
  )
}

bootstrap()
