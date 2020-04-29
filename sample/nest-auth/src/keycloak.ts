import * as KeycloakConnect from 'keycloak-connect'
import * as session from 'express-session'
import { INestApplication } from '@nestjs/common'

var memoryStore = new session.MemoryStore()

const keycloak: any = new KeycloakConnect(
  {
    store: memoryStore
  },
  {
    realm: 'nodejs-example',
    'auth-server-url': 'http://keycloak.sso.dev.smart2.cn/auth/',
    'ssl-required': 'external',
    resource: 'nodejs-connect',
    'public-client': true,
    'confidential-port': 0
  } as any
)

export function registerKeycloak(app: INestApplication) {
  app.use(
    session({
      secret: 'mySecret',
      resave: false,
      saveUninitialized: true,
      store: memoryStore
    })
  )

  /**
   * 注册 logout 中间件
   * 请求 logout 即可退出中间件
   */
  app.use(
    keycloak.middleware({
      logout: '/logout',
      admin: '/'
    })
  )

  /**
   * 默认拦截所有接口
   */
  // app.use(keycloak.protect())
}

export { keycloak, session, memoryStore }
export { Grant } from 'keycloak-connect'
