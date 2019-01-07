# haru

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Build Status](https://travis-ci.org/tkesgar/haru.svg?branch=master)](https://travis-ci.org/tkesgar/haru)
[![codecov](https://codecov.io/gh/tkesgar/haru/branch/master/graph/badge.svg)](https://codecov.io/gh/tkesgar/haru)
[![Greenkeeper badge](https://badges.greenkeeper.io/tkesgar/haru.svg)](https://greenkeeper.io/)

haru is a library to make password hashing simpler.

## Motivation

  - Let's use JSON and Base64 encoding. It is based on a public standard, widely available on
    various platforms, and relatively easy to use without gotchas.
  - For a given hash, we only have to store the hash itself, a salt to make the hash unique, and a
    *cost factor* to adjust the hash strength.

## Specification

A haru JSON is a JSON string that, if parsed, results in an object with at least the following
fields:

  - `v` (type: `string`): specifying the Haru **version** (current version: `HARU10`)
  - `h` (type: `string`): the computed **hash** string, encoded in Base64
  - `s` (type: `string`): the **salt** used for computing the hash, encoded in Base64
  - `c` (type: `number`): a **cost** number associated with the hash

The hash is computed from an arbitrary UTF-8 string using PBKDF2 with the following parameters:

  - Salt: the content of `s`
  - Number of iterations: 10000 * `c`
  - Key length: 64
  - Digest algorithm: SHA512

The following haru JSON is created from the famous password `correct horse battery staple`,
Base64-encoded salt `7GUk0MlUrjA=`, and cost 1 (PBKDF2 iteration = 10000):

```json
{
  "v": "HARU10",
  "h": "Fz3ZzqwZ3See6L5+ddmbjYYchNIQpu6lRGIvZZXGz4XCDXWDCWzS9hZvu3F1QfiPB7FAoVDNOH9a//Tc9bg4YA==",
  "s": "7GUk0MlUrjA=",
  "c": 1
}
```

The following haru JSON is created from yet another famous password `margaretthatcheris110%SEXY`,
Base64-encoded salt `J++Jb6DTXKw=`, and cost 6.5536 (PBKDF2 iteration = 65536):

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

const h = await Haru.fromPassword('correct horse battery staple')

console.log(await h.test('Tr0ub4dor&3'))
// > false

console.log(await h.test('correct horse battery staple'))
// > true
```

## API

### `static Haru.fromObject(obj): Haru`

Given an object `obj`, reads the value of `obj.v`, `obj.h`, `obj.s`, and `obj.c` and creates
a new `Haru` instance using the provided value.

  - `obj.v` is expected to be the string `'HARU10'`.
  - `obj.h` and `obj.s` is assumed to be a valid Base64 string containing the hash and the salt.
  - `obj.c` is assumed to be a valid cost number.

### `static Haru.fromJSON(json): Haru`

Parses the string `json` as JSON and sends the result to `Haru.fromObject(obj)`.

### `static async Haru.fromPassword(password[, salt, cost]): Haru`

Given a password string `password`, an optional salt `salt`, and an optional cost number `cost`,
creates a new `Haru` instance using the provided value.

  - `password` is assumed to be an UTF-8 string.
  - `salt` is assumed to be a `Buffer` instance containing the salt value. If `salt` is not
    provided, a cryptographically random 16-byte salt will be generated.
  - `cost` is assumed to be a valid cost number.

### `async Haru.test(password): boolean`

Tests whether the stored hash in the `Haru` instance matches `password`.

Resolves with `true` if the password matches, `false` otherwise.

### `Haru.toObject(): object`

Returns an object with the fields `v`, `h`, `s`, `c` such that with a given `Haru` instance `H`,
`Haru.fromObject(H.toObject())` returns the same hash.

### `Haru.toString(): string`

Converts `Haru.toObject()` into JSON string.

## CLI

### `haru-pass <password> [salt] [cost]`

Runs `Haru.fromPassword(password, salt, cost)` and prints the resulting hash object to standard
output as JSON string.

### `haru-test <password>`

Reads the `Haru` instance JSON from standard input and tests whether the given `password` matches.
Prints `true` if the password matches, `false` otherwise.

## Contribute

Feel free to create [issues][issue] or submit [pull requests][pull].

## Todo

  - Make haru isomophic using Web Crypto API

## License

Licensed under [MIT License][license].

[issue]: https://github.com/tkesgar/haru/issues
[pull]: https://github.com/tkesgar/haru/pulls
[license]: https://github.com/tkesgar/haru/blob/master/LICENSE
