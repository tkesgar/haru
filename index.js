const createSalt = require('./lib/create-salt')
const stdMethods = require('./lib/methods')

const HaruDefault = new Haru()

class Haru {
  static get stdMethods() {
    return stdMethods
  }

  static get HaruDefault() {
    return HaruDefault
  }

  constructor(methods = Haru.stdMethods) {
    return class {
      static fromArray(arr) {
        const [methodName, hash, salt, time] = arr
        const {fn} = methods[methodName]
        return new this(fn, hash, salt, time)
      }

      static fromJSON(json) {
        return this.fromArray(JSON.parse(json))
      }

      static async fromPassword(password, methodName, time, salt = createSalt()) {
        const {fn} = methods[methodName]
        const hash = await fn(password, salt, time)
        return new this(fn, hash, salt, time)
      }

      constructor(fn, hash, salt, time) {
        this.toString = () => JSON.stringify([method, hash, salt, time])
        this.test = async password => hash === (await fn(password, salt, time))
      }
    }
  }
}

module.exports = Haru
