export const REDIS_SERVICE = Symbol('REDIS_SERVICE')
export const MUTEX_LOCK = Symbol('MUTEX_LOCK')

export interface LockOption {
  retryCount: number
  retryDelay?: number
}
