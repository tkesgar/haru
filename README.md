# haru

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Build Status](https://travis-ci.org/tkesgar/haru.svg?branch=master)](https://travis-ci.org/tkesgar/haru)
[![codecov](https://codecov.io/gh/tkesgar/haru/branch/master/graph/badge.svg)](https://codecov.io/gh/tkesgar/haru) [![Greenkeeper badge](https://badges.greenkeeper.io/tkesgar/haru.svg)](https://greenkeeper.io/)

haru helps with serializing and deserializing passwords.

Currently haru uses the built-in Node.js `pbkdf2` function to calculate hashes from password.

## Installation

```sh
$ npm i @tkesgar/haru
```

## Usage

```js
const Haru = require('haru')

// Example user obtained from database; haru JSON is stored in user.pass.
const user = findUserByName('admin')

const h = Haru.fromString(user.pass)
console.log(await h.isPassword('Tr0ub4dor&3')) // output: false
console.log(await h.isPassword('correct horse battery staple')) // output: true

// Generate a new user.
createNewUser({
  name: 'foo',
  pass: await Haru.fromPassword('bar')
})

const h2 = Haru.fromString(findUserByName('foo').pass)
console.log(await h2.isPassword('bar')) // output: true

// Use custom PBKDF2 parameters.
createNewUser({
  name: 'haru',
  pass: await Haru.fromPassword('0512', {
    iterations: 1000000,
    encoding: 'hex'
  })
})

const h3 = Haru.fromString(findUserByName('haru').pass)
console.log(await h3.isPassword('0512')) // output: true
```

## API

### `static fromObject(obj): Haru`

Returns a new `Haru` instance from the provided object.

The object must have all the required haru properties (see below) in correct format; if any of the field does not exist or has an incorrect format, haru will throw an error. Excess properties or array elements are ignored.

### `static fromString(str): Haru`

Shorthand for `Haru.fromObject(JSON.parse(str))`.

### `static async fromPassword(password, salt = null, opts = {}): Haru`

Resolves to a new `Haru` instance from the provided `password`, `salt`, and PBKDF2 parameters in `opts`.

If `salt` is falsy, `crypto.randomBytes(16)` encoded as `encoding` will be used.

Values for `opts`:
  - `iterations`: number of iterations
  - `keylen`: length of generated key
  - `digest`: digest algorithm
  - `encoding`: encoding used for hashes

Default parameters:
  - `iterations`: `100000`
  - `keylen`: `64`
  - `digest`: `'sha512'`
  - `encoding`: `'base64'`

> **Note**: Any encoding that is supported by Node.js for `Buffer` can be used for `encoding`. For web development I recommend using `'base64'`, or `'hex'` in rare cases where Base64 encoding is not available.

### `toString(): string`

Returns the compact haru JSON string for this instance.

### `async isPassword(password): boolean`

Resolves to `true` if `password` matches the password stored in this instance, or `false` otherwise.

### `async update(password): Haru`

Resolves to a new `Haru` instance with the parameters matching the current instance.

## Serialization

haru JSON format:

```json
{
  "v": "HARU1",
  "h": "<% EXAMPLE HASH %>",
  "s": "<% EXAMPLE SALT %>",
  "p": [
    100000,
    64,
    "sha512",
    "base64"
  ]
}
```

Description:
  - `v`: haru **version** (`string`)
  - `h`: **hash** value of string (`string`)
  - `s`: **salt** used for hash calculation (`string`)
  - `p`: array of **parameters** used for hash calculation (`array`)
    - `p[0]`: number of iterations (`number`)
    - `p[1]`: derived key length (`number`)
    - `p[2]`: hash digest (`string`)
    - `p[3]`: encoding (`string`)

haru instances can be serialized into JSON with `toString()` function and deserialized from JSON with `Haru.fromString()` static function.

## Versioning

Currently only `HARU1` version exists.

## Contributions

Feel free to create issues and send pull requests.

## Why haru?

Refers to Haru Okumura from Persona 5.

## License

Licensed under MIT License.
