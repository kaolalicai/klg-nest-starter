import 'reflect-metadata'
import { Redlock } from './Redlock'
import * as _ from 'lodash'
import { MutexLockOption } from './RedlockInterface'

const LockKeyMetaKey = Symbol('kalengo:LockKey')

export interface ILockKeyMetaData {
	index: number
	keyPath?: string
}

/**
 * 根据参数指定Lock的值
 * @param keyPath
 * @constructor
 */
export const LockKey = (keyPath?: string): ParameterDecorator => {
	return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
		const existingParameters: Array<ILockKeyMetaData> = Reflect.getOwnMetadata(LockKeyMetaKey, target, propertyKey) || []
		existingParameters.push({index: parameterIndex, keyPath})
		Reflect.defineMetadata(LockKeyMetaKey, existingParameters, target, propertyKey)
	}
}

export function MutexLock (key?: string): any
export function MutexLock (option?: MutexLockOption): any

export function MutexLock (param: string | MutexLockOption): any {
	return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		let resourceKey: string
		let ttl = 60 * 1000
		if (typeof param === 'string') {
			resourceKey = param
		} else if (typeof param === 'object') {
			resourceKey = param.key
			if (param.ttl >= 0) ttl = param.ttl
		}

		const originalMethod = descriptor.value

		descriptor.value = async function (...args) {
			const redlockService = this['redlockService']
			if (!redlockService) throw new Error('请注入redlockService')
			const redlock: Redlock = redlockService.getMutex()
			resourceKey = resourceKey ? resourceKey : getLockKey(target, propertyKey, ...args)
			const res = redlock.using(async () => {
				return originalMethod.apply(this, args)
			}, {resource: resourceKey, ttl})
			return res
		}
		return descriptor
	}
}

const getLockKey = (target, propertyKey, ...args) => {
	let resourceKey = ''
	const lockKeyMetaIndex: Array<ILockKeyMetaData> = Reflect.getOwnMetadata(LockKeyMetaKey, target, propertyKey)
	if (lockKeyMetaIndex) {
		if (lockKeyMetaIndex.length > 1) throw new Error('一个函数内只能有一个LockKey注解')
		const value = args[lockKeyMetaIndex[0].index]
		// 如果是字符串则直接取该值
		if (typeof (value) === 'string') {
			resourceKey = value
		} else if (typeof (value) === 'object') {
			// 如果是对象则取该对象[注解参数]的值
			resourceKey = _.get(value, lockKeyMetaIndex[0].keyPath)
		}
	}
	return resourceKey
}
