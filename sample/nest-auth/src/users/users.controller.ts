import { Controller, Get, Post, Body, Req, HttpException, HttpStatus, Query } from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from './users.service'
import { ApiOkResponse, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'
import { UserDto, FindUsersRes, RegisterRes, FindAccountRes } from './users.dto'

@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {
  }

  @Post('/register')
  @ApiOkResponse({
    description: 'find one account',
    type: RegisterRes
  })
  async register (@Body() createUserDto: UserDto) {
    return await this.usersService.register(createUserDto)
  }

  @Get()
  @ApiCreatedResponse({
    description: 'find user list',
    type: FindUsersRes
  })
  async findAll (): Promise<number[]> {
    return this.usersService.findAll()
  }

  @Get('/hello')
  @ApiOkResponse({
    description: 'Hello World!'
  })
  async hello (): Promise<string> {
    return 'Hello World!'
  }

  @Get('/protect')
  async protect (@Req() req: Request): Promise<string> {
    let userInfo = (req as any).kauth.grant.access_token.content
    console.log('userInfo', userInfo)
    return 'protect info'
  }

  @Get('/err')
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async err (): Promise<string> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
  }

  @Post('/update')
  @ApiOkResponse({
    description: 'update one user',
    type: FindAccountRes
  })
  async update (
    @Query('userId') userId: string
  ): Promise<string> {
    return this.usersService.update(userId)
  }
}
