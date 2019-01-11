const crypto = require('crypto')

const ITER_BASE = 10000
const KEYLEN = 64
const SALT_SIZE = 16
const VERSION = 'HARU10'
const DIGEST = 'sha512'

const DEFAULT_COST = 2.0

/* eslint-disable-next-line max-params */
function pbkdf2(password, salt, iterations, keylen, digest) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
      return err ? reject(err) : resolve(key)
    })
  })
}

class Haru {
  static get DEFAULT_COST() {
    return DEFAULT_COST
  }

  static fromObject(obj) {
    const {
      v: version,
      h: hashB64,
      s: saltB64,
      c: cost
    } = obj

    if (version !== VERSION) {
      throw new TypeError(`Expected version to be '${VERSION}', got '${version}'`)
    }

    if (typeof cost !== 'number') {
      throw new TypeError(`Expected typeof cost to be 'number', got '${typeof cost}'`)
    }

    const hash = Buffer.from(hashB64, 'base64')
    const salt = Buffer.from(saltB64, 'base64')
    return new Haru(hash, salt, cost)
  }

  static fromJSON(json) {
    return Haru.fromObject(JSON.parse(json))
  }

  static async fromPassword(password, salt = createSalt(), cost = Haru.DEFAULT_COST) {
    const hash = await createHash(password, salt, cost)
    return new Haru(hash, salt, cost)
  }

  static test(h, password) {
    if (h instanceof Haru) {
      return h.test(password)
    }

    if (typeof h === 'string') {
      return Haru.fromJSON(h).test(password)
    }

    return Haru.fromObject(h).test(password)
  }

  constructor(hash, salt, cost) {
    this.hash = hash
    this.salt = salt
    this.cost = cost
  }

  async test(password) {
    const passwordHash = await createHash(password, this.salt, this.cost)
    return this.hash.compare(passwordHash) === 0
  }

  toObject() {
    return {
      v: VERSION,
      h: this.hash.toString('base64'),
      s: this.salt.toString('base64'),
      c: this.cost
    }
  }

  toJSON() {
    return JSON.stringify(this.toObject())
  }

  toString() {
    return this.toJSON()
  }
}

module.exports = Haru

function createSalt() {
  return crypto.randomBytes(SALT_SIZE)
}

function createHash(password, salt, cost) {
  return pbkdf2(password, salt, Math.floor(ITER_BASE * cost), KEYLEN, DIGEST)
}
