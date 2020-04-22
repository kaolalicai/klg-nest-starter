import {DynamicModule, Module, Logger} from '@nestjs/common'
import {RedisModule} from 'nestjs-redis'
import {parseConfig} from '../ConfigParse'

async function onClientReady (client) {
  client.on('error',
    (err) => {
      Logger.log('redis error', err)
    }
  )
}

@Module({})
export class RedisModuleBuilder {
  static forRoot (): DynamicModule {
    let {redisConfig} = parseConfig()
    let connections = []
    let con = RedisModule.register({
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
