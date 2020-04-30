import * as config from 'config'
import { Module, DynamicModule, Provider, Global } from '@nestjs/common'
import * as KeycloakConnect from 'keycloak-connect'
import { KeycloakConnectOptions } from './interface/keycloak-connect-options.interface'
import { KEYCLOAK_CONNECT_OPTIONS, KEYCLOAK_INSTANCE } from './constants'

@Global()
@Module({})
export class KeycloakConnectModule {
  public static forRoot(opts: KeycloakConnectOptions): DynamicModule {
    return {
      module: KeycloakConnectModule,
      providers: [
        {
          provide: KEYCLOAK_CONNECT_OPTIONS,
          useValue: opts
        },
        this.keycloakProvider
      ],
      exports: [this.keycloakProvider]
    }
  }

  private static keycloakProvider: Provider = {
    provide: KEYCLOAK_INSTANCE,
    useFactory: (opts: KeycloakConnectOptions) => {
      const keycloakOpts: any = config.get('keycloak')
      const keycloak: any = new KeycloakConnect(
        { cookies: false },
        keycloakOpts as any
      )

      // Access denied is called, add a flag to request so our roles guard knows
      keycloak.accessDenied = (req: any, res: any, next: any) => {
        req.resourceDenied = true
        next()
      }

      // Disable keycloak redirectToLogin
      keycloak.redirectToLogin = (req: any) => {
        return false
      }
      return keycloak
    },
    inject: [KEYCLOAK_CONNECT_OPTIONS]
  }
}
