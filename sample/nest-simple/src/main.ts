import {NestFactory} from '@nestjs/core'
import {ApplicationModule} from './app.module'
import {appSettings} from './settings'

async function bootstrap () {
  const app = await NestFactory.create(ApplicationModule)
  appSettings(app)

  await app.listen(process.env.PORT || 3000)
  console.log(
    `Application(${ process.env.NODE_ENV }) is running on: ${ await app.getUrl() }`
  )
}

bootstrap()
