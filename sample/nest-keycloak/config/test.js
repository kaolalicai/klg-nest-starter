module.exports = {
  port: process.env.PORT || 3000,
  keycloak: {
    realm: 'nodejs-example',
    'auth-server-url': 'http://keycloak.sso.dev.smart2.cn/auth/',
    'ssl-required': 'external',
    resource: 'nodejs-apiserver',
    'verify-token-audience': false,
    credentials: {
      secret: 'a6cdcf7c-6e87-4e6d-9e45-4bd6c7b9a0d6'
    },
    'confidential-port': 0,
    'policy-enforcer': {}
  }
}
