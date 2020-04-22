import {Injectable, Inject} from '@nestjs/common'
import {MUTEX_LOCK} from './RedlockInterface'
import {Redlock} from './Redlock'

@Injectable()
export class RedlockService {
  constructor (
    @Inject(MUTEX_LOCK) private readonly mutex: Redlock
  ) {
  }

  getMutex (): Redlock {
    return this.mutex
  }
}
