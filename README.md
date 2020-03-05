# haru

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

TBD

## Installation

```sh
$ npm install @tkesgar/haru
```

> This package requires Node.js v10.5.0 or above (for `scrypt` support).

## Usage

```ts
import Haru from "haru";

const h = await Haru.fromPassword("correct horse battery staple");

console.log(await h.test("Tr0ub4dor&3")); // false
console.log(await h.test("correct horse battery staple")); // true
```

## Contribute

Feel free to create [issues][issue] or submit [pull requests][pull].

## License

Licensed under [MIT License][license].

[issue]: https://github.com/tkesgar/haru/issues
[pull]: https://github.com/tkesgar/haru/pulls
[license]: https://github.com/tkesgar/haru/blob/master/LICENSE
