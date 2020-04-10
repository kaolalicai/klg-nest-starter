import * as supertest from 'supertest'
import {ApplicationModule} from '../src/app.module'
import {HttpExceptionFilter} from '../src/common/filters/http-exception.filter'
import {TransformInterceptor} from '../src/common/interceptors/transform.interceptor'
import {Test} from '@nestjs/testing'

export async function bootstrap () {
  // init nestjs
  const moduleFixture = await Test.createTestingModule({
    imports: [ApplicationModule]
  }).compile()
  const app = moduleFixture.createNestApplication()
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.init()
  const request = supertest(app.getHttpServer())
  return {app, request}
}
