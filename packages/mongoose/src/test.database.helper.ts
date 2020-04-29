import {Logger, Module} from '@nestjs/common'
import {getConnectionToken, getModelToken} from 'nestjs-typegoose'
import * as Mock from 'mockjs'
import {parseConfig} from './config.parse'

@Module({})
export class TestDatabaseHelper {

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
        Logger.debug('initFixtures ', items.length + '')
        await model.create(items)
        return items
    }

    static async clearDatabase(app) {
        const {mongoConfigs} = parseConfig()
        for (const c of mongoConfigs) {
            const connect = app.get(getConnectionToken(c.name))
            for (const key of Object.keys(connect.collections)) {
                Logger.debug('delete ', key + '')
                await connect.collections[key].deleteMany({})
            }
        }
    }
}
