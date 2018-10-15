const crypto = require('crypto')
const util = require('util')

const pbkdf2 = util.promisify(crypto.pbkdf2)

function createPbkdf2Fn(keylen, digest) {
  return async (password, salt, time) => {
    const buffer = await pbkdf2(password, salt, time * 1000, keylen, digest)
    return buffer.toString('base64')
  }
}

module.exports = createPbkdf2Fn
