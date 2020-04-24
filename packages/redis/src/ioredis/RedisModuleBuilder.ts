import { DynamicModule, Module, Logger } from '@nestjs/common'
import { RedisModule } from 'nestjs-redis'
import { parseConfig } from '../ConfigParse'

async function onClientReady(client) {
  client.on('error', (err) => {
    Logger.log('redis error', err)
  })
}

@Module({})
export class RedisModuleBuilder {
  static forRoot(): DynamicModule {
    const { redisConfig } = parseConfig()
    const connections = []
    const con = RedisModule.register({
      url: redisConfig.uri,
      onClientReady: onClientReady
    })
    connections.push(con)
    return {
      module: RedisModuleBuilder,
      imports: connections
    }
  }
}
