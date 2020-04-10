import {UserTemplate} from './model-mock-template'
import {getConnectionToken, getModelToken} from 'nestjs-typegoose'
import {Test} from '@nestjs/testing'
import {ApplicationModule} from '../src/app.module'
import {INestApplication} from '@nestjs/common'
import * as supertest from 'supertest'
import * as Mock from 'mockjs'
import {HttpExceptionFilter} from '../src/common/filters/http-exception.filter'
import {TransformInterceptor} from '../src/common/interceptors/transform.interceptor'
import {parseConfig} from '../src/common/config-parse'

process.env.NODE_ENV = 'test'
console.log('current env', process.env.NODE_ENV)

let app: INestApplication
let request: supertest.SuperTest<supertest.Test>

async function genUsers (nums: number, fixData?: Function) {
  return await genFixtures(UserTemplate, nums, 'User', fixData)
}

async function genFixtures (template: object, nums: number, modelName: string, fixData?: Function) {
  if (!fixData) fixData = (i, it) => it
  let items = Array(10).fill(0).map((index, value) => fixData(index, template))
  let model = app.get(getModelToken(modelName))
  console.log('initFixtures ', items.length)
  let data = items.map(it => Mock.mock(it))
  await model.create(data)
  return data
}

async function clearDatabase () {
  const {mongoConfigs} = parseConfig()
  for (let c of mongoConfigs) {
    let connect = app.get(getConnectionToken(c.name))
    for (let key of Object.keys(connect.collections)) {
      console.log('delete ', key)
      await connect.collections[key].deleteMany({})
    }
  }
}

async function initApp () {
  // init nestjs
  const moduleFixture = await Test.createTestingModule({
    imports: [ApplicationModule]
  }).compile()
  app = moduleFixture.createNestApplication()
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.init()
  request = supertest(app.getHttpServer())
}

beforeAll(async function () {
  await initApp()
  await clearDatabase()
})

afterAll(async () => {
  await app.close()
})

export {app, request, genUsers, genFixtures}
