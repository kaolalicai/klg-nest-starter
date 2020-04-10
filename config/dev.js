module.exports = {
  port: process.env.PORT || 3000,
  schedule: true,
  mongodb: {
    debug: true,
    connections: [
      {
        name: 'core',
        url: 'mongodb://localhost:57017/core'
      },
      {
        name: 'app',
        url: 'mongodb://localhost:57017/app'
      }
    ]
  }
}
