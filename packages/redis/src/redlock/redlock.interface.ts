export interface LockOption {
  retryCount: number
  retryDelay?: number
}

export type BufferOptions = LockOption

export interface DecoratorLockOption {
  key?: string
  ttl?: number
}
