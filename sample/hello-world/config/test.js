module.exports = {
  port: process.env.PORT || 3000,
  mongodb: {
    debug: true,
    connections: [
      {
        name: 'core',
        url: 'mongodb://localhost:57017/core_test',
        options: {}
      },
      {
        name: 'app',
        url: 'mongodb://localhost:57017/app_test',
        options: {}
      }
    ]
  }
}
