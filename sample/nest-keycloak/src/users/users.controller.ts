import { Controller, Get, Req, Inject, Logger } from '@nestjs/common'
import * as _ from 'lodash'
import { Request } from 'express'
import { UsersService } from './users.service'
import { KEYCLOAK_INSTANCE, Roles, Keycloak } from '@kalengo/keycloak'

@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name)

  constructor(
    private readonly usersService: UsersService,
    @Inject(KEYCLOAK_INSTANCE)
    private readonly keycloak: Keycloak
  ) {}

  @Get()
  @Roles('realm:admin')
  async findAll(): Promise<number[]> {
    return this.usersService.findAll()
  }

  @Get('/hello')
  async hello(): Promise<string> {
    return 'Hello World!'
  }

  @Get('/info')
  @Roles('realm:user', 'realm:none')
  async protect(@Req() req: Request): Promise<string> {
    const userInfo = (req as any).user
    console.log('userInfo', userInfo)
    return 'protect info'
  }

  @Get('/login')
  async login(): Promise<string | { token: string }> {
    const username = 'user'
    const password = 'password'
    try {
      const grant = await this.keycloak.grantManager.obtainDirectly(
        username,
        password
      )
      // console.info('grant', grant)
      const token: string = _.get(grant, 'access_token.token')
      this.logger.verbose('access_token', token)
      return { token }
    } catch (e) {
      this.logger.verbose('login fail', e)
      return 'login fail'
    }
  }
}
