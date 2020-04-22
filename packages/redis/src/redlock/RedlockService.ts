import {Injectable, Inject} from '@nestjs/common'
import {Redlock} from './Redlock'
import {BUFFER_LOCK, MUTEX_LOCK} from './redlock.constants'

@Injectable()
export class RedlockService {
  constructor (
    @Inject(MUTEX_LOCK) private readonly mutex: Redlock,
    @Inject(BUFFER_LOCK) private readonly buffer: Redlock
  ) {
  }

  getMutex (): Redlock {
    return this.mutex
  }

  getBuffer (): Redlock {
    return this.buffer
  }
}
