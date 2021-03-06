import 'reflect-metadata'
import { Redlock } from '../redlock/Redlock'
import * as _ from 'lodash'
import { DecoratorLockOption } from '../redlock/redlock.interface'
import { Inject } from '@nestjs/common'
import { RedlockService } from '../redlock/redlock.service'

const LockKeyMetaKey = Symbol('kalengo:LockKey')

export interface ILockKeyMetaData {
  index: number
  keyPath?: string
}

/**
 * 指定LockKey的值，如果Method装饰器已经指定了key，则该配置无效。
 * @param keyPath key的路径,参考lodash的get方法
 * @constructor
 */
export const LockKey = (keyPath?: string): ParameterDecorator => {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const existingParameters: Array<ILockKeyMetaData> =
      Reflect.getOwnMetadata(LockKeyMetaKey, target, propertyKey) || []
    existingParameters.push({ index: parameterIndex, keyPath })
    Reflect.defineMetadata(
      LockKeyMetaKey,
      existingParameters,
      target,
      propertyKey
    )
  }
}

function lockWrap(
  lockType: string,
  lockParam: { resourceKey: string; ttl: number },
  originalMethod,
  serviceName: string,
  lockKeyMetaIndex: Array<ILockKeyMetaData>
) {
  const { resourceKey, ttl } = lockParam
  return async function (this: any, ...args) {
    const redlockService: RedlockService = this[serviceName]
    if (!redlockService)
      throw new Error(
        '自动注入redlockService失败，请检查是否在全局注入RedlockService'
      )
    const resource = resourceKey
      ? resourceKey
      : getLockKey(lockKeyMetaIndex, ...args)

    const redlock: Redlock =
      lockType === 'mutex'
        ? redlockService.getMutex()
        : redlockService.getBuffer()
    const res = redlock.using(
      async () => {
        return originalMethod.apply(this, args)
      },
      { resource, ttl }
    )
    return res
  }
}

function lockDecoratorBuilder(
  param: string | DecoratorLockOption,
  type: string
) {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    let serviceName = 'redlockService'
    Inject(RedlockService)(target, serviceName)
    const lockKeyMetaIndex: Array<ILockKeyMetaData> = Reflect.getOwnMetadata(
      LockKeyMetaKey,
      target,
      propertyKey
    )
    descriptor.value = lockWrap(
      type,
      parseParam(param),
      descriptor.value,
      serviceName,
      lockKeyMetaIndex
    )
    return descriptor
  }
}

/**
 * 排他锁
 * @param key 指定该锁的key值
 * @constructor
 */
export function MutexLock(key?: string): any

/**
 * 排他锁
 * @param option 配置
 * @constructor
 */
export function MutexLock(option?: DecoratorLockOption): any

export function MutexLock(param: string | DecoratorLockOption): any {
  return lockDecoratorBuilder(param, 'mutex')
}

/**
 * 非公平重试锁
 * @param key 指定该锁的key值
 * @constructor
 */
export function BufferLock(key?: string): any

/**
 * 非公平重试锁
 * @param option 配置
 * @constructor
 */
export function BufferLock(option?: DecoratorLockOption): any

export function BufferLock(param: string | DecoratorLockOption) {
  return lockDecoratorBuilder(param, 'buffer')
}

function parseParam(param: string | DecoratorLockOption) {
  let resourceKey: string
  let ttl = 60 * 1000
  if (typeof param === 'string') {
    resourceKey = param
  } else if (typeof param === 'object') {
    resourceKey = param.key
    if (param.ttl >= 0) ttl = param.ttl
  }
  return { resourceKey, ttl }
}

const getLockKey = (lockKeyMetaIndex: Array<ILockKeyMetaData>, ...args) => {
  let resourceKey = ''
  if (lockKeyMetaIndex) {
    if (lockKeyMetaIndex.length > 1)
      throw new Error('一个函数内只能有一个LockKey注解')
    const value = args[lockKeyMetaIndex[0].index]
    // 如果是字符串则直接取该值
    if (typeof value === 'string') {
      resourceKey = value
    } else if (typeof value === 'object') {
      // 如果是对象则取该对象[注解参数]的值
      resourceKey = _.get(value, lockKeyMetaIndex[0].keyPath)
    }
  }
  if (_.isEmpty(resourceKey))
    throw new Error(
      '锁的key为空，请在Lock注解参数中指定key的值或者使用LockKey装饰器'
    )
  return resourceKey
}
