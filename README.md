# haru

[![TypeScript](https://img.shields.io/npm/types/scrub-js.svg)](https://www.typescriptlang.org/)
[![Code style: ESLint](https://img.shields.io/badge/code%20style-ESLint-blueviolet)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![Build Status](https://travis-ci.org/tkesgar/haru.svg?branch=master)](https://travis-ci.org/tkesgar/haru)
[![codecov](https://codecov.io/gh/tkesgar/haru/branch/master/graph/badge.svg)](https://codecov.io/gh/tkesgar/haru)

> Please confide in me if you ever need help. I'll be there for you.

haru is a library to help with password hashing.

## Specification

A `HARU20` object contains the following fields:

- `v`: the version string (`"HARU20"`)
- `h`: the computed hash, encoded as Base64 string
- `s`: the salt for computing the hash, encoded as Base64
- `m`: the hash method
- `p`: an array of values for the method

Currently available hash method:

- `1`: PBKDF2
- `2`: scrypt

### PBKDF2 hash

Parameters: `[N]`

- `N`: number of iterations for PBKDF2

The hash is computed from an arbitrary UTF-8 string `password` using PBKDF2 with
the following parameters:

- Salt: an arbitrary salt
- Number of iterations: `N`
- Key length: 64
- Digest algorithm: SHA512

### scrypt hash

Parameters: `[N, r, p, m]`

- `N`: CPU/memory cost parameter
- `r`: block size parameter
- `p`: parallelization parameter
- `m`: memory upper bound

The hash is computed from an arbitrary UTF-8 string `password` using scrypt with
the following parameters:

- Salt: an arbitrary salt
- Key length: 64
- CPU/memory cost: `N`
- Block size: `r`
- Parallelization: `p`
- Memory upper bound: `m`

### Migration from `HARU10`

It is possible to convert the hash stored in `HARU10` to `HARU20`.

An example of hash `HARU10` format:

```json
{
  "v": "HARU10",
  "h": "Hk+3J2J6bc07pe8x7s5JeNtCPop8hKVRrj4Ae8xwI6eUzjPPKaVT8uk4/0mi+rNldaRs/OiHseHRNs7ukQ1Jrg==",
  "s": "J++Jb6DTXKw=",
  "c": 6.5536
}
```

The same hash in `HARU20` format:

```json
{
  "v": "HARU20",
  "h": "Hk+3J2J6bc07pe8x7s5JeNtCPop8hKVRrj4Ae8xwI6eUzjPPKaVT8uk4/0mi+rNldaRs/OiHseHRNs7ukQ1Jrg==",
  "s": "J++Jb6DTXKw=",
  "m": 1,
  "p": [65536]
}
```

### Examples

#### PBKDF2

```json
{
  "v": "HARU20",
  "h": "b2TD+AI4E9jCyrQ8q/qmXtBhgir+l0Bg2AedEi+4afQg7iW8mZ81LkgqsZWD6aaufKt6m6PlOzam8NGjZaCqQA==",
  "s": "c2FsdA==",
  "m": 1,
  "p": [65536]
}
```

#### Scrypt

```json
{
  "v": "HARU20",
  "h": "dFcxr0SE8yOWiWntoomu7gBbWQOsVh5kpayhIXl793NO+f1YQi4uIhg7ysup7Ie6DIO3oueI8Dzg2gZGNDPNpg==",
  "s": "c2FsdA==",
  "m": 2,
  "p": [16384, 8, 1, 33554432]
}
```

## Installation

```sh
$ npm install @tkesgar/haru
```

> This package requires Node.js v10.5.0 or above (for `scrypt` support).

## Usage

### Create a new password hash

```js
import { fromPassword } from "@tkesgar/haru";

const haru = await fromPassword("correct horse battery staple");

console.log(await haru.test("Tr0ub4dor&3")); // false
console.log(await haru.test("correct horse battery staple")); // true
```

### Save password hash to storage

```js
import { fromPassword } from "@tkesgar/haru";

// Create a new Haru instance
const haru = await fromPassword("correct horse battery staple");

// Serialize password hash to string
const passwordHash = JSON.stringify(haru);

// Save password hash
const user = await User.findByName("admin");
await user.set("password_hash", passwordHash);
```

### Load password hash from storage

```js
import { fromJSON, test } from "@tkesgar/haru";

// Load password hash
const user = await User.findByName("admin");
const passwordHash = user.get("password_Hash"); // `{"v":"HARU20",...}`

// Read JSON to create Haru instance
const haru = fromJSON(passwordHash);

// Check password
if (await haru.test("correct horse battery staple")) {
  console.log("Hello admin!");
}

// One-liner using test
if (await test(passwordHash, "correct horse battery staple")) {
  console.log("Hello admin!");
}
```

## Contribute

Feel free to create [issues][issue] or submit [pull requests][pull].

## License

Licensed under [MIT License][license].

[issue]: https://github.com/tkesgar/haru/issues
[pull]: https://github.com/tkesgar/haru/pulls
[license]: https://github.com/tkesgar/haru/blob/master/LICENSE
