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
  }
}
