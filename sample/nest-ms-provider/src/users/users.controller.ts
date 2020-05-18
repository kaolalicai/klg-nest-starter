import { Controller, Get, Post, Body, HttpException } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserDto } from './users.dto'
import { MessagePattern } from '@nestjs/microservices'
import { of, Observable } from 'rxjs'
import { delay } from 'rxjs/operators'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() createUserDto: UserDto) {
    return await this.usersService.register(createUserDto)
  }

  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  @MessagePattern({ cmd: 'sum' })
  accumulate(data: number[]): Observable<number> {
    // if (1 > 0) {
    //   throw new HttpException('error', 503)
    // }
    return of(15).pipe(delay(2000))
  }
}
