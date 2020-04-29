import { DynamicModule, Module } from '@nestjs/common'
import * as mongoose from 'mongoose'
import { TypegooseModule } from 'nestjs-typegoose'
import { parseConfig } from './config.parse'

@Module({})
export class TypegooseModuleBuilder {
  static forRoot(): DynamicModule {
    const { mongoConfigs, debugMongoose } = parseConfig()

    mongoose.set('debug', debugMongoose)

    const connections = []
    for (const c of mongoConfigs) {
      const typegooseModule = TypegooseModule.forRoot(
        c.url,
        Object.assign({ connectionName: c.name }, c.options)
      )
      // connections.push(...typegooseModule.imports)
      connections.push(typegooseModule)
    }
    return {
      module: TypegooseModuleBuilder,
      imports: connections
    }
  }
}
