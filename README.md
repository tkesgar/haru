# haru

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Build Status](https://travis-ci.org/tkesgar/haru.svg?branch=master)](https://travis-ci.org/tkesgar/haru)
[![codecov](https://codecov.io/gh/tkesgar/haru/branch/master/graph/badge.svg)](https://codecov.io/gh/tkesgar/haru)
[![Greenkeeper badge](https://badges.greenkeeper.io/tkesgar/haru.svg)](https://greenkeeper.io/)

haru is a library to make password hashing simpler.

## Motivation

  - We should serialize the hash in a widely available serialization format. Let's use JSON and Base64 encoding.
  - The only required fields for a hash is the hash itself, a salt to make the hash unique, and a *cost factor* that can be adjusted to make hash computation easier or harder. High cost factor makes the generated hash more secure but requires more resource (time/space) to compute, and vice versa.

## Specification

A haru JSON is a JSON string that, if parsed, results in an object with at
least the following fields:

  - `v` (type: `string`): specifying the Haru **version** (current version: `HARU10`)
  - `h` (type: `string`): the computed **hash** string, encoded in Base64
  - `s` (type: `string`): the **salt** used for computing the hash, encoded in Base64
  - `c` (type: `number`): a **cost** number associated with the hash

The hash is computed from an arbitrary UTF-8 string using PBKDF2 with the following parameters:

  - Salt: the content of `s`
  - Number of iterations: 10000 * `c`
  - Key length: 64
  - Digest algorithm: SHA512

The following haru JSON is created from the famous password `correct horse battery staple`, Base64-encoded salt `7GUk0MlUrjA=`, and cost 1 (PBKDF2 iteration = 10000):

```json
{
  "v": "HARU10",
  "h": "Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==",
  "s": "7GUk0MlUrjA=",
  "c": 1
}
```

The following haru JSON is created from yet another famous password `margaretthatcheris110%SEXY`, Base64-encoded salt `J++Jb6DTXKw=`, and cost 6.5536 (PBKDF2 iteration = 65536):

```json
{
  "v": "HARU10",
  "h": "Hk+3J2J6bc07pe8x7s5JeNtCPop8hKVRrj4Ae8xwI6eUzjPPKaVT8uk4/0mi+rNldaRs/OiHseHRNs7ukQ1Jrg==",
  "s": "J++Jb6DTXKw=",
  "c": 6.5536
}
```

## Usage

```js
const Haru = require('haru')

const h = await Haru.fromPassword('correct horse battery staple')

console.log(await h.test('Tr0ub4dor&3'))
// > false

console.log(await h.test('correct horse battery staple'))
// > true
```

## API

### `static Haru.fromObject(obj): Haru`

### `static Haru.fromJSON(json): Haru`

### `static async Haru.fromPassword(password[, salt, cost]): Haru`

### `async Haru.test(password): boolean`

### `Haru.toObject(): object`

### `Haru.toString(): string`

## Installation

```sh
$ npm install @tkesgar/haru
```

## Contribute

Feel free to create [issues][issue] or submit [pull requests][pull].

## Todo

  - [ ] Add CLI for haru
  - [ ] Make haru isomophic using Web Crypto API

## License

Licensed under [MIT License][license].

[chara-img]: https://static.zerochan.net/Noir.%28Persona.5%29.full.2087595.jpg
[chara-img-src]: https://www.zerochan.net/2087595
[chara]: http://megamitensei.wikia.com/wiki/Haru_Okumura
[work]: https://en.wikipedia.org/wiki/Persona_5
[issue]: https://github.com/tkesgar/haru/issues
[pull]: https://github.com/tkesgar/haru/pulls
[license]: https://github.com/tkesgar/haru/blob/master/LICENSE
