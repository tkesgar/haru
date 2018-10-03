const crypto = require('crypto')
const util = require('util')
const AbstractHaru = require('./abstract-haru')

const pbkdf2 = util.promisify(crypto.pbkdf2)

class Haru0 extends AbstractHaru {
  static get version() {
    return 'HARU0'
  }

  static fromObject(obj) {
    const {h: hash, s: salt} = obj
    return new Haru0(hash, salt)
  }

  static async fromPassword(password, salt = createSalt()) {
    return new Haru0(await calculateHash(password, salt), salt)
  }

  toString() {
    return super.toString(Haru0.version)
  }

  getHash(str) {
    return calculateHash(str, this.salt)
  }
}

module.exports = Haru0

function createSalt() {
  return crypto.randomBytes(8).toString('hex')
}

async function calculateHash(password, salt = createSalt()) {
  const buffer = await pbkdf2(password, salt, 100000, 64, 'sha512')
  return buffer.toString('hex')
}
