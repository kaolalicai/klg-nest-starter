import {NestFactory} from '@nestjs/core'
import {ApplicationModule} from './app.module'
import {HttpExceptionFilter} from './common/filters/http-exception.filter'
import {TransformInterceptor} from './common/interceptors/transform.interceptor'

async function bootstrap () {
  const app = await NestFactory.create(ApplicationModule)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(process.env.PORT || 3000)
  console.log(`Application is running on: ${ await app.getUrl() }`)
}

bootstrap()
