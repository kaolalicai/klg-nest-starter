import { Controller, Get, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/getAndSet')
  async getAndSet() {
    return await this.usersService.getAndSet()
  }

  @Get('/mutex')
  async mutex() {
    return await this.usersService.mutex()
  }

  @Get('/buffer')
  async buffer() {
    return await this.usersService.buffer()
  }

  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  @Get('/hello')
  async hello(): Promise<string> {
    return 'Hello World!'
  }

  @Get('/decorator/mutex')
  async decoratorMutex() {
    return await this.usersService.decoratorMutex({
      list: ['list1'],
      name: 'deo'
    })
  }

  @Get('/decorator/buffer')
  async decoratorBuffer() {
    return await this.usersService.decoratorBuffer({
      list: ['list1'],
      name: 'deo'
    })
  }
}
