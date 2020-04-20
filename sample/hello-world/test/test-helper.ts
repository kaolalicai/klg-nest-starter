import {TestDateBaseHelper} from '@kalengo/mongoose'
import {INestApplication} from '@nestjs/common'
import * as supertest from 'supertest'
import {bootstrap} from './main'
import {TestingModule} from '@nestjs/testing'

process.env.NODE_ENV = 'test'
console.log('current env', process.env.NODE_ENV)

let app: INestApplication
let testModule: TestingModule
let request: supertest.SuperTest<supertest.Test>

export async function genFixtures (template: object, nums: number, modelName: string, fixData?: (it: object, i: number) => any) {
  return TestDateBaseHelper.genFixtures(app as any, template, nums, modelName, fixData)
}

beforeAll(async function () {
  const res = await bootstrap()
  app = res.app
  request = res.request
  testModule = res.testModule
  await TestDateBaseHelper.clearDatabase(app as any)
})

afterAll(async () => {
  await app.close()
})

export {app, request, testModule}
