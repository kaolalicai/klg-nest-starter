module.exports = {
  port: process.env.PORT || 3000,
  schedule: true,
  mongodb: {
    debug: true,
    connections: [
      {
        url: 'mongodb://localhost:57017/zeebe',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      }
    ]
  }
}
