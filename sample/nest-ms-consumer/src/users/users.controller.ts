import { Controller, Get, Post, Body, Inject } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserDto } from './users.dto'
import { Observable } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import { logger } from '@kalengo/utils'

@Controller('/')
export class UsersController {
  constructor (
    private readonly usersService: UsersService,
    @Inject('MATH_SERVICE') private readonly client: ClientProxy
  ) {
  }

  @Post('/register')
  async register (@Body() createUserDto: UserDto) {
    return await this.usersService.register(createUserDto)
  }

  @Get()
  async findAll () {
    return this.usersService.findAll()
  }

  @Get('/accumulate')
  async accumulate (): Promise<number> {
    const pattern = { cmd: 'sum' }
    const data = [1, 2, 3, 4, 5]
    const res = this.client.send<number>(pattern, data)
    const total = await res.toPromise()
    logger.info('total', total)
    return res.toPromise()
  }

  @Get('/accumulate2')
  accumulate2 (): Observable<number> {
    const pattern = { cmd: 'sum' }
    const data = [1, 2, 3, 4, 5]
    return this.client.send<number>(pattern, data)
  }
}
