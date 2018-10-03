const crypto = require('crypto')
const util = require('util')
const AbstractHaru = require('./abstract-haru')

const randomBytes = util.promisify(crypto.randomBytes)
const pbkdf2 = util.promisify(crypto.pbkdf2)

const VERSION = 'HARU1'
const ITERATIONS = 100000
const KEYLEN = 64
const DIGEST = 'sha512'
const ENCODING = 'base64'
const SALTLEN = 16
const HARU0_ENCODING = 'hex'

class Haru1 extends AbstractHaru {
  static get version() {
    return VERSION
  }

  static fromObject(obj) {
    const {
      h: hash,
      s: salt,
      p: params = [ITERATIONS, KEYLEN, DIGEST, ENCODING]
    } = obj

    if (Array.isArray(params)) {
      if (params.length < 4) {
        throw new TypeError(`Invalid parameter array length provided (length: ${params.length})'`)
      }
    } else {
      throw new TypeError(`Invalid object: 'params' is not an array (got: ${typeof params})`)
    }

    const [iterations, keylen, digest, encoding] = params
    checkType('iterations', iterations, 'number')
    checkType('keylen', keylen, 'number')
    checkType('digest', digest, 'string')
    checkType('encoding', encoding, 'string')

    return new Haru1(hash, salt, [iterations, keylen, digest, encoding])
  }

  static async fromPassword(password, salt = null, opts = {}) {
    const {
      iterations = ITERATIONS,
      keylen = KEYLEN,
      digest = DIGEST,
      encoding = ENCODING
    } = opts

    salt = salt || await createSalt(encoding)

    const params = [iterations, keylen, digest, encoding]
    return new Haru1(await calculateHash(password, salt, params), salt, params)
  }

  static fromHaru0(haru0) {
    const hash = Buffer.from(haru0.hash, HARU0_ENCODING).toString(ENCODING)
    const salt = Buffer.from(haru0.salt, HARU0_ENCODING).toString(ENCODING)
    return new Haru1(hash, salt)
  }

  constructor(hash, salt, params = [ITERATIONS, KEYLEN, DIGEST, ENCODING]) {
    super(hash, salt)
    this.params = params
  }

  toString() {
    return super.toString(Haru1.version, {p: this.params})
  }

  getHash(str) {
    return calculateHash(str, this.salt, this.params)
  }
}

module.exports = Haru1

function checkType(name, value, type) {
  if (!value && typeof value !== type) {
    throw new TypeError(`Invalid type for ${name}: expected '${type}', got '${typeof value}'`)
  }
}

async function createSalt(encoding) {
  return (await randomBytes(SALTLEN)).toString(encoding)
}

async function calculateHash(str, salt = null, params = [ITERATIONS, KEYLEN, DIGEST, ENCODING]) {
  const [iterations, keylen, digest, encoding] = params

  salt = salt || await createSalt(encoding)

  const buffer = await pbkdf2(str, salt, iterations, keylen, digest, encoding)
  return buffer.toString(encoding)
}
