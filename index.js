const Haru0 = require('./lib/haru0')
const Haru1 = require('./lib/haru1')

class Haru {
  static fromObject(obj, upgrade = true, latest = false) {
    const {
      v: version,
      h: hash,
      s: salt
    } = obj

    if (typeof version !== 'string') {
      throw new TypeError(`Invalid type for 'v': '${typeof version}' (expected: 'string')`)
    }

    if (typeof hash !== 'string') {
      throw new TypeError(`Invalid type for 'h': '${typeof hash}' (expected: 'string')`)
    }

    if (typeof salt !== 'string') {
      throw new TypeError(`Invalid type for 's': '${typeof salt}' (expected: 'string')`)
    }

    switch (version) {
      case Haru0.version: {
        if (latest) {
          throw new Error(`Encountered old haru object (version: ${version})`)
        }

        const h = Haru0.fromObject(obj)
        return upgrade ? Haru1.fromHaru0(h) : h
      }
      case Haru1.version:
        return Haru1.fromObject(obj)
      default:
        throw new Error(`Unknown version: '${version}'`)
    }
  }

  static fromString(str) {
    return Haru.fromObject(JSON.parse(str))
  }

  static fromPassword(password, salt = null, opts = {}) {
    return Haru1.fromPassword(password, salt, opts)
  }
}

module.exports = Haru
