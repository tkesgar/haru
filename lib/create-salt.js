const {randomBytes} = require('crypto')

function createSalt(length = 16) {
  return randomBytes(length).toString('base64').slice(0, length)
}

module.exports = createSalt
