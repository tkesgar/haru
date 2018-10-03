class AbstractHaru {
  constructor(hash, salt) {
    this.hash = hash
    this.salt = salt
  }

  toString(version, props = {}) {
    return JSON.stringify({
      v: version,
      h: this.hash,
      s: this.salt,
      ...props
    })
  }

  async isPassword(password) {
    return (await this.getHash(password)) === this.hash
  }
}

module.exports = AbstractHaru
