module.exports = {
  port: process.env.PORT || 3000,
  schedule: true,
  keycloak: {
    realm: 'nodejs-example',
    'auth-server-url': 'http://keycloak.sso.dev.smart2.cn/auth/',
    'ssl-required': 'external',
    resource: 'nodejs-apiserver',
    'verify-token-audience': false,
    credentials: {
      secret: 'c800c1a6-5c1a-4012-a008-6cf8bf6c50ad'
    },
    'confidential-port': 0,
    'policy-enforcer': {}
  }
}
