module.exports = {
  port: process.env.PORT || 3000,
  mongodb: {
    debug: false,
    connections: [
      {
        name: 'core',
        url: process.env.CORE_MONGODB,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      },
      {
        name: 'app',
        url: process.env.APP_MONGODB,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      }
    ]
  },
  redis: {
    uri: process.env.REDIS_URI || 'redis://localhost:6379',
    prefix: process.env.REDIS_PREFIX || 'redis_'
  }
}
