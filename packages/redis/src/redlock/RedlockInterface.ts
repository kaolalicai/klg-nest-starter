export interface LockOption {
  retryCount: number
  retryDelay?: number
}

export interface BufferOptions extends LockOption {

}
