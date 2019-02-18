# haru

> Makes password hashing simpler

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Build Status](https://travis-ci.org/tkesgar/haru.svg?branch=master)](https://travis-ci.org/tkesgar/haru)
[![codecov](https://codecov.io/gh/tkesgar/haru/branch/master/graph/badge.svg)](https://codecov.io/gh/tkesgar/haru)
[![Greenkeeper badge](https://badges.greenkeeper.io/tkesgar/haru.svg)](https://greenkeeper.io/)

haru is an interface to make password hashing simpler.

> Also check [@tkesgar/futaba][futaba] for simpler hashing.

## Specification

A haru object is an object with the following fields:

  - `v` (type: `string`): the object **version**
  - `h` (type: `string`): the Base64-encoded computed **hash**
  - `s` (type: `string`): the Base64-encoded **salt** used for computing the hash
  - `c` (type: `number`): the **cost** number associated with the hash

The current version string of Haru is `"HARU10"`.

The hash is computed from an arbitrary UTF-8 string using PBKDF2 with the following parameters:

  - Salt: the salt from haru object
  - Number of iterations: c × 10000
  - Key length: 64
  - Digest algorithm: SHA512

### Example 1

  - String: `correct horse battery staple`
  - Salt: `7GUk0MlUrjA=` (Base64)
  - Cost: 1 (PBKDF iterations = 10k)

```json
{
  "v": "HARU10",
  "h": "Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==",
  "s": "7GUk0MlUrjA=",
  "c": 1
}
```

### Example 2

  - String: `margaretthatcheris110%SEXY`
  - Salt: `J++Jb6DTXKw=` (Base64)
  - Cost: 6.5536 (PBKDF iterations = 65,536)

```json
{
  "v": "HARU10",
  "h": "Hk+3J2J6bc07pe8x7s5JeNtCPop8hKVRrj4Ae8xwI6eUzjPPKaVT8uk4/0mi+rNldaRs/OiHseHRNs7ukQ1Jrg==",
  "s": "J++Jb6DTXKw=",
  "c": 6.5536
}
```

## Installation

```sh
$ npm install @tkesgar/haru
```

## Usage

```js
const Haru = require('haru')

const h = await Haru.create('correct horse battery staple')

console.log(await h.test('Tr0ub4dor&3'))                   // false
console.log(await h.test('correct horse battery staple'))  // true
```

## API

### `static Haru.DEFAULT_COST`

A value that will be used as default cost. This value might be updated over time to ensure that new
hashes are reasonably strong.

### `static async Haru.create(password[, opts]): Haru`

Creates a new Haru instance using the provided `password`.

Options:
  - `salt`: a `Buffer` containing the value that will be used as salt. If it is not provided,
    a cryptographically random 16-bytes salt will be generated.
  - `cost`: the cost value. If `cost` is not provided, `Haru.DEFAULT_COST` will be used.

### `static Haru.from(val): Haru`

If `val` is an object, read `val.h`, `val.s`, and `val.c` and create a new Haru instance using the
provided value.

### `static Haru.test(val, password): Promise<boolean> | boolean`

Convenience function for `Haru.from(val).test(password)`. If `val` is a Haru instance, return
`val.test(password)`.

### new Haru(hash, salt, cost)

The constructor function. `hash` and `salt` is expected to be an instance of `Buffer`.

### `async Haru.test(password): boolean`

Tests whether the stored hash in the `Haru` instance matches `password`.

Resolves with `true` if the password matches, `false` otherwise.

### `Haru.toObject(): object`

Returns the haru object representation of the instance.

### `Haru.toString(): string`

Returns the JSON string of the instance.

### `Haru.toJSON(): string`

Alias for `Haru.toString()`. This allows Haru instances to be converted into JSON via [JSON.stringify()][tojson].

## Contribute

Feel free to create [issues][issue] or submit [pull requests][pull].

## Todo

  - Make haru isomophic using Web Crypto API

## License

Licensed under [MIT License][license].

[issue]: https://github.com/tkesgar/haru/issues
[pull]: https://github.com/tkesgar/haru/pulls
[license]: https://github.com/tkesgar/haru/blob/master/LICENSE
[futaba]: https://www.npmjs.com/package/@tkesgar/futaba
[tojson]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
