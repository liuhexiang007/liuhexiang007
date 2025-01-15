const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/', {
    target: 'http://192.168.100.23:8610',
    changeOrigin: true
  }))
}
