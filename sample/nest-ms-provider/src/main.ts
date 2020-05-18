import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { appSettings } from './settings'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule)
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'ms_queue',
      queueOptions: {
        durable: false
      }
    }
  })
  appSettings(app)

  await app.startAllMicroservicesAsync()
  await app.listen(process.env.PORT || 3002)
  console.log(
    `Application(${process.env.NODE_ENV}) is running on: ${await app.getUrl()}`
  )
}

bootstrap()
