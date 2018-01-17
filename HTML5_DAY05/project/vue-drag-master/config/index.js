// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: {NODE_ENV: '"production"'},
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsPublicPath: '/dist/'
    },
    dev: {
        env: {NODE_ENV: '"development"'},
        assetsPublicPath: '/'
    }
}