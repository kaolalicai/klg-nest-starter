import {TestDateBaseHelper} from '@akajs/mongoose'
import {INestApplication} from '@nestjs/common'
import * as supertest from 'supertest'
import * as server from '../src/server'

process.env.NODE_ENV = 'test'
console.log('current env', process.env.NODE_ENV)

let app: INestApplication
let request: supertest.SuperTest<supertest.Test>

export async function genFixtures (template: object, nums: number, modelName: string, fixData?: (it: object, i: number) => any) {
  return TestDateBaseHelper.genFixtures(app as any, template, nums, modelName, fixData)
}

beforeAll(async function () {
  app = await server.bootstrap()
  request = supertest(app.getHttpServer())
  await TestDateBaseHelper.clearDatabase(app as any)
})

afterAll(async () => {
  await app.close()
})

export {app, request}
