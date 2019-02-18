const crypto = require('crypto')
const util = require('util')

const DEFAULT_COST = 2.0

const VERSION = 'HARU10'
const ITERBASE = 10000
const KEYLEN = 64
const DIGEST = 'sha512'
const ENCODING = 'base64'
const SALTLEN = 16

const pbkdf2 = util.promisify(crypto.pbkdf2)

class Haru {
  static get DEFAULT_COST() {
    return DEFAULT_COST
  }

  static async create(password, opts = {}) {
    const {
      salt = createSalt(),
      cost = DEFAULT_COST
    } = opts

    const hash = await createHash(password, salt, cost)
    return new Haru(hash, salt, cost)
  }

  static from(val) {
    if (typeof val === 'string') {
      return Haru.from(JSON.parse(val))
    }

    const {h, s, c} = val

    const hash = Buffer.from(h, ENCODING)
    const salt = Buffer.from(s, ENCODING)
    return new Haru(hash, salt, c)
  }

  static test(val, password) {
    if (val instanceof Haru) {
      return val.test(password)
    }

    return Haru.from(val).test(password)
  }

  constructor(hash, salt, cost) {
    this.hash = hash
    this.salt = salt
    this.cost = cost
  }

  async test(password) {
    return this.hash.compare(await createHash(password, this.salt, this.cost)) === 0
  }

  toObject() {
    return {
      v: VERSION,
      h: this.hash.toString(ENCODING),
      s: this.salt.toString(ENCODING),
      c: this.cost
    }
  }

  toString() {
    return JSON.stringify(this.toObject())
  }

  toJSON() {
    return this.toString()
  }
}

module.exports = Haru

function createSalt() {
  return crypto.randomBytes(SALTLEN).toString(ENCODING)
}

function createHash(password, salt, cost) {
  const iterations = Math.floor(ITERBASE * cost)
  return pbkdf2(password, salt, iterations, KEYLEN, DIGEST)
}
