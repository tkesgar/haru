const createPbkdf2Fn = require('../create-pbkdf2-fn')

module.exports = {
  'haru-pbkdf2-sha256': {
    fn: createPbkdf2Fn(32, 'sha256')
  },
  'haru-pbkdf2-sha384': {
    fn: createPbkdf2Fn(48, 'sha384')
  },
  'haru-pbkdf2-sha512': {
    fn: createPbkdf2Fn(64, 'sha512')
  },
  'haru-pbkdf2-whirlpool': {
    fn: createPbkdf2Fn(64, 'whirlpool')
  }
}
