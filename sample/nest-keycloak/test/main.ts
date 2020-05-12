import * as supertest from 'supertest'
import { ApplicationModule } from '../src/app.module'
import { Test } from '@nestjs/testing'
import { appSettings } from '../src/settings'
import { AuthGuard, RolesGuard } from '@kalengo/keycloak'

export { prefix } from '../src/settings'

export async function bootstrap() {
  // init nestjs
  const testModule = await Test.createTestingModule({
    imports: [ApplicationModule]
  })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile()
  const app = testModule.createNestApplication()
  appSettings(app)
  await app.init()
  const request = supertest(app.getHttpServer())
  return { app, request, testModule }
}

export async function bootstrapWithAuth() {
  // init nestjs
  const testModule = await Test.createTestingModule({
    imports: [ApplicationModule]
  }).compile()
  const app = testModule.createNestApplication()
  appSettings(app)
  await app.init()
  const request = supertest(app.getHttpServer())
  return { app, request, testModule }
}
