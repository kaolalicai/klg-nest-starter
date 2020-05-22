import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ApplicationModule } from './app.module'
import { appSettings } from './settings'

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule)

  appSettings(app)

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Nest Starter')
    .setDescription('The Server API description')
    .setVersion('1.0')
    .addTag('starter')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 3000)
  console.log(
    `Application(${process.env.NODE_ENV}) is running on: ${await app.getUrl()}`
  )
}

bootstrap()
