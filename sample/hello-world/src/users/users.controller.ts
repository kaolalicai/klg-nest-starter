import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { IUserModel } from './model/user.model'
import { IAccountModel } from './model/account.model'
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiResponse
} from '@nestjs/swagger'
import { UserDto, FindUsersRes, RegisterRes, FindAccountRes } from './users.dto'
import { DateUtil, logger } from '@kalengo/utils'
import { BusinessException } from '@kalengo/web'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiOkResponse({
    description: 'find one account',
    type: RegisterRes
  })
  async register(@Body() createUserDto: UserDto) {
    return await this.usersService.register(createUserDto)
  }

  @Get()
  @ApiCreatedResponse({
    description: 'find user list',
    type: FindUsersRes
  })
  async findAll(): Promise<IUserModel[]> {
    return this.usersService.findAll()
  }

  @Get('/date')
  async date(): Promise<string> {
    logger.info('get date')
    return DateUtil.format()
  }

  @Get('/hello')
  @ApiOkResponse({
    description: 'Hello World!'
  })
  async hello(): Promise<string> {
    return 'Hello World!'
  }

  @Get('/err')
  @ApiResponse({ status: 1, description: 'Forbidden.' })
  async err(): Promise<string> {
    throw new BusinessException()
  }

  @Get('/account')
  @ApiNotFoundResponse()
  @ApiOkResponse({
    description: 'find one account',
    type: FindAccountRes
  })
  async getAccountAndUser(
    @Query('userId') userId: string
  ): Promise<IAccountModel> {
    return this.usersService.getAccountAndUser(userId)
  }
}
