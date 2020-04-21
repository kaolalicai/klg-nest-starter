import * as config from 'config'
import * as _ from 'lodash'
import * as Lock from 'redlock'
import {logger} from '@kalengo/utils'

const {prefix} = config.redis

export class Redlock {
  redlock: Lock
  prefix: string = prefix || 'core:lock:'

  constructor ({retryCount = 0, retryDelay = 400}) {
    this.redlock = new Lock(
      [new RedisUtil().getClient()],
      {
        // the expected clock drift; for more details
        // see http://redis.io/topics/distlock
        driftFactor: 0.01, // time in ms
        // the max number of times Redlock will attempt
        // to lock a resource before erroring
        retryCount,

        // the time in ms between attempts
        retryDelay, // time in ms

        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter: 400 // time in ms
      }
    )
  }

  /**
   * 分布式锁
   * @param func 待执行的函数
   * @param lockParam options
   */
  async using (func: Function, lockParam: { resource: string, ttl?: number, autoUnLock?: boolean }) {
    lockParam.ttl = _.toInteger(lockParam.ttl) || 1000 * 60
    if (lockParam.autoUnLock === undefined) lockParam.autoUnLock = true
    let lock = null
    try {
      lock = await this.redlock.lock(this.prefix + lockParam.resource, lockParam.ttl)
      logger.info('lock success ', lock.resource)
    } catch (err) {
      logger.info('系统繁忙，请稍后再试 lock Error ', err)
      // if (this.lockConfig.handle) this.lockConfig.handle(err)
      throw new Error('系统繁忙，请稍后再试')
    }
    // 执行业务逻辑
    let result
    try {
      result = await func(lock)
    } catch (err) {
      // 出现业务错误也要解锁
      await lock.unlock()
      logger.info('business error，unlock success ', lock.resource)
      throw err
    }
    // 记得解锁
    if (lockParam.autoUnLock) {
      try {
        await lock.unlock()
        logger.info('unlock success ', lock.resource)
      } catch (err) {
        logger.error('unlock Error ', err)
      }
    }
    return result
  }
}

export const redlockBuffer = new Redlock({
  retryCount: Math.floor(1000 * 60 * 15 / 400), // 重试次数 这里需要重试10分钟
  retryDelay: 400   // 重试间隔
})
export const redlockMutex = new Redlock({
  retryCount: 0
})
