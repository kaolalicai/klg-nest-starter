import { Controller, Get, Post, Body } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserDto } from './users.dto'

@Controller('users')
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
}
