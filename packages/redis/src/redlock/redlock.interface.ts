export interface LockOption {
  retryCount: number
  retryDelay?: number
}

export type BufferOptions = LockOption
