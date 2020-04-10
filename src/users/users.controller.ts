import {Controller, Get, Post, Body, HttpException, HttpStatus, Query} from '@nestjs/common'
import {CreateUsersDto} from './dto/create-users.dto'
import {UsersService} from './users.service'
import {IUserModel} from './model/user.model'
import {IAccountModel} from './model/account.model'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {
  }

  @Post('/register')
  async register (@Body() createUserDto: CreateUsersDto) {
    await this.usersService.register(createUserDto)
  }

  @Get()
  async findAll (): Promise<IUserModel[]> {
    return this.usersService.findAll()
  }

  @Get('/hello')
  async hello (): Promise<string> {
    return 'Hello World!'
  }

  @Get('/err')
  async err (): Promise<string> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
  }

  @Get('/account')
  async getAccountAndUser (@Query('userId') userId: string): Promise<IAccountModel> {
    return this.usersService.getAccountAndUser(userId)
  }
}
