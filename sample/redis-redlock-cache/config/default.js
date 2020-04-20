module.exports = {
  port: process.env.PORT || 3000,
  redis: {
    uri: process.env.REDIS_URI || 'redis://localhost:6379',
    prefix: process.env.REDIS_PREFIX || 'redis_'
  },
}
