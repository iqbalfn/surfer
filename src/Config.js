const path = require('node:path')
const base = path.dirname(__dirname)
const configFile = path.join(base, 'config.js')

module.exports = require(configFile)
