const Haru0 = require('../lib/haru0')

describe('version', () => {
  test('should be HARU0', () => {
    expect(Haru0.version).toBe('HARU0')
  })
})

describe('fromObject', () => {
  test('should get hash and salt properly', () => {
    const obj = {
      h: 'd6f698b41337cc493191827bda0c12ae5d9ca020e948919b20901d85e7ca71f0da36cba8e07e8ce1022cf2f99efc3dd945af67577ff5cd16792e0a5562f08de1',
      s: 'svcie38rf3716kxt'
    }

    const h = Haru0.fromObject(obj)
    expect(h.hash).toEqual(obj.h)
    expect(h.salt).toEqual(obj.s)
  })
})

describe('fromPassword', () => {
  test('should work with provided salt', async () => {
    const h = await Haru0.fromPassword('password', 'salt')

    expect(h.hash).toBe('f5d17022c96af46c0a1dc49a58bbe654a28e98104883e4af4de974cda2c74122dd082f4105a93fc80692ca4eb1a784cfeda81bfaa33f5192cc9143d818bd7581')
    expect(h.salt).toBe('salt')
    expect(await h.isPassword('password')).toBe(true)
  })

  test('should work without salt', async () => {
    const h = await Haru0.fromPassword('password')
    expect(await h.isPassword('password')).toBe(true)
  })
})

describe('toString', () => {
  test('should equals the result', () => {
    const obj = {
      v: 'HARU0',
      h: 'd6f698b41337cc493191827bda0c12ae5d9ca020e948919b20901d85e7ca71f0da36cba8e07e8ce1022cf2f99efc3dd945af67577ff5cd16792e0a5562f08de1',
      s: 'svcie38rf3716kxt'
    }

    expect(Haru0.fromObject(obj).toString()).toBe(JSON.stringify(obj))
  })
})

describe('getHash', () => {
  test('should return correct hash', async () => {
    const h = await Haru0.fromPassword('test', 'salt')

    expect(await h.getHash('test')).toBe(h.hash)
  })

  test('should return correct hash', async () => {
    const h = await Haru0.fromPassword('test', 'salt')

    expect(await h.getHash('password')).toBe('f5d17022c96af46c0a1dc49a58bbe654a28e98104883e4af4de974cda2c74122dd082f4105a93fc80692ca4eb1a784cfeda81bfaa33f5192cc9143d818bd7581')
  })
})
