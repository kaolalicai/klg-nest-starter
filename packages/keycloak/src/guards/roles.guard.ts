import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as _ from 'lodash'
import { Keycloak, GaurdFn } from 'keycloak-connect'
import { KEYCLOAK_INSTANCE } from '../constants'

/**
 * This adds a resource guard, which is permissive.
 * Only controllers annotated with `@Resource` and methods with `@Scopes`
 * are handled by this guard.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  logger = new Logger(RolesGuard.name)

  constructor(
    @Inject(KEYCLOAK_INSTANCE)
    private keycloak: Keycloak,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    if (!roles) {
      return true
    }
    const [request, response] = [
      context.switchToHttp().getRequest(),
      context.switchToHttp().getResponse()
    ]
    const resource = request.url

    this.logger.verbose(
      `Protecting resource '${resource}' with role: [ ${roles} ]`
    )

    // const user = request.user;
    // const hasRole = () => user.roles.some((role) => roles.includes(role));
    // return user && user.roles && hasRole();

    // Build permissions
    const permissions = function pants(token: any) {
      return _.some(roles, (role) => token.hasRole(role))
    }
    // const permissions = roles[0]
    const user = _.get(request, 'user.preferred_username')

    // try  execute the protect middleware of Keycloak
    const enforcerFn = createProtectContext(request, response)
    const isAllowed = await enforcerFn(this.keycloak, permissions)

    if (!isAllowed) {
      this.logger.verbose(`Resource '${resource}' denied to '${user}'.`)
      throw new NotAcceptableException()
    }
    this.logger.verbose(`Resource '${resource}' granted to '${user}'.`)

    return true
  }
}

const createProtectContext = (request: any, response: any) => (
  keycloak: Keycloak,
  spec: GaurdFn | string
) =>
  new Promise<boolean>((resolve, reject) =>
    keycloak.protect(spec)(request, response, (next: any) => {
      if (request.resourceDenied) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  )
