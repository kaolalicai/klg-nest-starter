export interface LockOption {
	retryCount: number
	retryDelay?: number
}

export type BufferOptions = LockOption

export interface MutexLockOption {
	key?: string
	ttl?: number
}
