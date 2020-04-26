import * as KeycloakConnect from 'keycloak-connect'
import * as session from 'express-session'
import {INestApplication} from '@nestjs/common'

var memoryStore = new session.MemoryStore()

// keycloak 服务的配置文件，可以在 keycloak 后台中导出
const keycloak: any = new KeycloakConnect(
  {
    store: memoryStore
  },
  {
    'realm': 'nodejs-example',
    'realm-public-key': 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrVrCuTtArbgaZzL1hvh0xtL5mc7o0NqPVnYXkLvgcwiC3BjLGw1tGEGoJaXDuSaRllobm53JBhjx33UNv+5z/UMG4kytBWxheNVKnL6GgqlNabMaFfPLPCF8kAgKnsi79NMo+n6KnSY8YeUmec/p2vjO2NjsSAVcWEQMVhJ31LwIDAQAB',
    'auth-server-url': 'http://10.10.21.4:8080/auth',
    'ssl-required': 'external',
    'resource': 'nodejs-connect',
    'public-client': true
  } as any)

export function registerKeycloak (app: INestApplication) {
  app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }))

  /**
   * 注册 logout 中间件
   * 请求 logout 即可退出中间件
   */
  app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/'
  }))

  /**
   * 默认拦截所有接口
   */
  app.use(keycloak.protect())
}

export {keycloak, session, memoryStore}
