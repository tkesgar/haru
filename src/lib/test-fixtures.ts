export const testSalt = Buffer.from("salt");

/**
 * Generated using https://stuff.birkenstab.de/pbkdf2/.
 *
 * - Password: `password`
 * - Salt: `salt`
 * - Iterations: `65536`
 * - Key length: `64`
 */
export const testHashPbkdf2V1 = Buffer.from(
  "6f64c3f8023813d8c2cab43cabfaa65ed061822afe974060d8079d122fb869f420ee25bc999f352e482ab19583e9a6ae7cab7a9ba3e53b36a6f0d1a365a0aa40",
  "hex"
);

/**
 * Generated using https://stuff.birkenstab.de/pbkdf2/.
 *
 * - Password: `password`
 * - Salt: `salt`
 * - Iterations: `10000`
 * - Key length: `64`
 */
export const testHashPbkdf2V2 = Buffer.from(
  "72629a41b076e588fba8c71ca37fadc9acdc8e7321b9cb4ea55fd0bf9fe8ed72def92b4c7dff5242a0254945b945394ce4d6008e947bdc7593085cd1e2f6a375",
  "hex"
);

/**
 * Generated using https://www.browserling.com/tools/scrypt.
 *
 * - Password: `password`
 * - Salt: `salt`
 * - Output size: `64`
 * - N: `16384`
 * - r: `8`
 * - p: `1`
 */
export const testHashScryptV1 = Buffer.from(
  "745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf7734ef9fd58422e2e22183bcacba9ec87ba0c83b7a2e788f03ce0da06463433cda6",
  "hex"
);

/**
 * Generated using https://www.browserling.com/tools/scrypt.
 *
 * - Password: `password`
 * - Salt: `salt`
 * - Output size: `64`
 * - N: `8192`
 * - r: `4`
 * - p: `2`
 */
export const testHashScryptV2 = Buffer.from(
  "59b7fd911221b495d3494cff88169abfce684c705491024f706c76adb6be0dbbb56932a72823671f21690299d684c6ce5cf382b7da1c57be33c778e7a5e6ea0f",
  "hex"
);
