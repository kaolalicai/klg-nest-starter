import * as _ from 'lodash'
import * as config from 'config'

export type RedisConfig = {
  uri: string,
  prefix: string
}

export function parseConfig (): { redisConfig: RedisConfig } {
  let redisConfig: RedisConfig
  try {
    redisConfig = config.get('redis')
  } catch (e) {
    throw new Error('redis config 不能为空')
  }
  if (_.isEmpty(redisConfig)) throw new Error('mongodb config 不能为空')
  return {redisConfig}
}
