/* eslint-env jest */
const Haru = require('..')

it('should export a function', () => {
  expect(typeof Haru).toBe('function')
})

describe('static Haru.fromObject', () => {
  it('should be present in Haru', () => {
    expect(typeof Haru.fromObject).toBe('function')
  })

  it('should fail if version does not exist', () => {
    const obj = {
      h: 'Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==',
      s: '7GUk0MlUrjA=',
      c: 1
    }

    expect(() => Haru.fromObject(obj)).toThrow()
  })

  it('should fail if hash does not exist', () => {
    const obj = {
      v: 'HARU10',
      s: '7GUk0MlUrjA=',
      c: 1
    }

    expect(() => Haru.fromObject(obj)).toThrow()
  })

  it('should fail if salt does not exist', () => {
    const obj = {
      v: 'HARU10',
      h: 'Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==',
      c: 1
    }

    expect(() => Haru.fromObject(obj)).toThrow()
  })

  it('should fail if cost does not exist', () => {
    const obj = {
      v: 'HARU10',
      h: 'Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==',
      s: '7GUk0MlUrjA='
    }

    expect(() => Haru.fromObject(obj)).toThrow()
  })

  it('should fail if version does not match', () => {
    const obj = {
      v: 'HARU1',
      h: 'Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==',
      s: '7GUk0MlUrjA=',
      c: 1
    }

    expect(() => Haru.fromObject(obj)).toThrow()
  })

  it('should fail if cost is not a number', () => {
    const obj = {
      v: 'HARU1',
      h: 'Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==',
      s: '7GUk0MlUrjA=',
      c: '1'
    }

    expect(() => Haru.fromObject(obj)).toThrow()
  })

  it('should match the snapshot result', async () => {
    const password = 'correct horse battery staple'
    const obj = {
      v: 'HARU10',
      h: 'Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==',
      s: '7GUk0MlUrjA=',
      c: 1
    }

    const h = Haru.fromObject(obj)
    expect(h).toMatchSnapshot()
    expect(await h.test(password)).toBe(true)
  })
})

describe('static Haru.fromJSON', () => {
  it('should be present in Haru', () => {
    expect(typeof Haru.fromJSON).toBe('function')
  })

  it('should match the snapshot result', async () => {
    const password = 'correct horse battery staple'
    const json = `{
      "v": "HARU10",
      "h": "Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==",
      "s": "7GUk0MlUrjA=",
      "c": 1
    }`

    const h = Haru.fromJSON(json)
    expect(h).toMatchSnapshot()
    expect(await h.test(password)).toBe(true)
  })
})

describe('static Haru.fromPassword', () => {
  it('should be present in Haru', () => {
    expect(typeof Haru.fromPassword).toBe('function')
  })

  it('should return a correct haru instance for a given password', async () => {
    const password = 'correct horse battery staple'

    const h = await Haru.fromPassword(password)
    expect(await h.test(password)).toBe(true)
  })

  it('should return a correct haru instance for a given password and salt', async () => {
    const password = 'correct horse battery staple'
    const salt = testSalt()

    const h = await Haru.fromPassword(password, salt)
    expect(await h.test(password)).toBe(true)
    expect(h.salt.compare(salt)).toBe(0)
  })

  it('should return a correct haru instance for a given password, salt, and cost', async () => {
    const password = 'correct horse battery staple'
    const salt = testSalt()
    const cost = 5

    const h = await Haru.fromPassword(password, salt, cost)
    expect(await h.test(password)).toBe(true)
    expect(h.salt.compare(salt)).toBe(0)
    expect(h.cost).toBe(cost)
  })

  it('should work with real number cost', async () => {
    const password = 'correct horse battery staple'
    const salt = testSalt()
    const cost = 3.141592653589793

    const h = await Haru.fromPassword(password, salt, cost)
    expect(await h.test(password)).toBe(true)
    expect(h.cost).toBe(cost)
  })

  it('should return different hash for different salt', async () => {
    const password = 'correct horse battery staple'
    const salt1 = Buffer.from('7GUk0MlUrjA=', 'base64')
    const salt2 = Buffer.from('J++Jb6DTXKw=', 'base64')

    const h1 = await Haru.fromPassword(password, salt1)
    const h2 = await Haru.fromPassword(password, salt2)
    expect(await h1.hash.compare(h2.hash)).not.toBe(0)
  })

  it('should return different hash for different cost', async () => {
    const password = 'correct horse battery staple'
    const salt = testSalt()
    const cost1 = 1
    const cost2 = 2

    const h1 = await Haru.fromPassword(password, salt, cost1)
    const h2 = await Haru.fromPassword(password, salt, cost2)
    expect(await h1.hash.compare(h2.hash)).not.toBe(0)
  })
})

describe('Haru.test', () => {
  it('should be present in Haru instance', async () => {
    const h = await testHaruInstance()
    expect(typeof h.test).toBe('function')
  })

  it('should match the correct password', async () => {
    const h = await testHaruInstance()
    expect(await h.test('correct horse battery staple')).toBe(true)
  })

  it('should not match the wrong password', async () => {
    const h = await testHaruInstance()
    expect(await h.test('Tr0ub4dor&3')).toBe(false)
  })
})

describe('Haru.toObject', () => {
  it('should be present in Haru instance', async () => {
    const h = await testHaruInstance()
    expect(typeof h.toObject).toBe('function')
  })

  it('should match the snapshot result', async () => {
    const h = await testHaruInstance()
    expect(h.toObject()).toMatchSnapshot()
  })
})

describe('Haru.toJSON', () => {
  it('should be present in Haru instance', async () => {
    const h = await testHaruInstance()
    expect(typeof h.toJSON).toBe('function')
  })

  it('should match the snapshot result', async () => {
    const h = await testHaruInstance()
    expect(h.toJSON()).toMatchSnapshot()
  })
})

describe('Haru.toString', () => {
  it('should be present in Haru instance', async () => {
    const h = await testHaruInstance()
    expect(typeof h.toString).toBe('function')
  })

  it('should match the snapshot result', async () => {
    const h = await testHaruInstance()
    expect(h.toString()).toMatchSnapshot()
  })

  it('should return the same result with toJSON', async () => {
    const h = await testHaruInstance()
    expect(h.toString()).toBe(h.toJSON())
  })
})

function testHaruInstance() {
  return Haru.fromPassword('correct horse battery staple', testSalt())
}

function testSalt() {
  return Buffer.from('7GUk0MlUrjA=', 'base64')
}
