import {getConnectionToken, getModelToken} from 'nestjs-typegoose'
import * as Mock from 'mockjs'
import {parseConfig} from '../src/common/config-parse'
import {INestApplication} from '@nestjs/common'
import * as supertest from 'supertest'
import {bootstrap} from './main'

process.env.NODE_ENV = 'test'
console.log('current env', process.env.NODE_ENV)

export async function genFixtures (template: object, nums: number, modelName: string, fixData?: (it: object, i: number) => any) {
  if (!fixData) fixData = (it: object, index: number) => it
  let model = app.get(getModelToken(modelName))
  let items = Array(10)
    .fill(0)
    .map((it: object) => Mock.mock(template))
    .map(fixData)
  console.log('initFixtures ', items.length)
  await model.create(items)
  return items
}

export async function clearDatabase () {
  const {mongoConfigs} = parseConfig()
  for (let c of mongoConfigs) {
    let connect = app.get(getConnectionToken(c.name))
    for (let key of Object.keys(connect.collections)) {
      console.log('delete ', key)
      await connect.collections[key].deleteMany({})
    }
  }
}

let app: INestApplication
let request: supertest.SuperTest<supertest.Test>

beforeAll(async function () {
  const res = await bootstrap()
  app = res.app
  request = res.request
  await clearDatabase()
})

afterAll(async () => {
  await app.close()
})

export {app, request}
