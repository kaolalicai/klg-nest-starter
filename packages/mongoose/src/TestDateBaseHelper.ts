import { Module } from '@nestjs/common'
import { logger } from '@kalengo/utils'
import { getModelToken, getConnectionToken } from 'nestjs-typegoose'
import * as Mock from 'mockjs'
import { parseConfig } from './ConfigParse'

@Module({})
export class TestDateBaseHelper {
  static async genFixtures(
    app,
    template: object,
    nums: number,
    modelName: string,
    fixData?: (it: object, i: number) => any
  ) {
    if (!fixData) fixData = (it: object, index: number) => it
    const model = app.get(getModelToken(modelName))
    const items = Array(nums)
      .fill(0)
      .map((it: object) => Mock.mock(template))
      .map(fixData)
    logger.debug('initFixtures ', items.length)
    await model.create(items)
    return items
  }

  static async clearDatabase(app) {
    const { mongoConfigs } = parseConfig()
    for (const c of mongoConfigs) {
      const connect = app.get(getConnectionToken(c.name))
      for (const key of Object.keys(connect.collections)) {
        logger.debug('delete ', key)
        await connect.collections[key].deleteMany({})
      }
    }
  }
}
