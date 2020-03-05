import crypto from "crypto";

export const DEFAULT_PBKDF2_ITERATIONS = 65536;
export const DEFAULT_SCRYPT_COST = 16384;
export const DEFAULT_SCRYPT_BLOCK_SIZE = 8;
export const DEFAULT_SCRYPT_PARALLELIZATION = 1;
export const DEFAULT_SCRYPT_MAX_MEMORY = 32 * 1024 * 1024;

export interface ScryptOptions {
  cost?: number;
  blockSize?: number;
  parallelization?: number;
  maxMemory?: number;
}

export function createSalt(size = 16): Buffer {
  return crypto.randomBytes(size);
}

export async function pbkdf2(
  password: string,
  salt = createSalt(),
  iterations = DEFAULT_PBKDF2_ITERATIONS
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(derivedKey);
      }
    );
  });
}

export async function scrypt(
  password: string,
  salt = createSalt(),
  opts: ScryptOptions = {}
): Promise<Buffer> {
  const {
    cost = DEFAULT_SCRYPT_COST,
    blockSize = DEFAULT_SCRYPT_BLOCK_SIZE,
    parallelization = DEFAULT_SCRYPT_PARALLELIZATION,
    maxMemory = DEFAULT_SCRYPT_MAX_MEMORY
  } = opts;

  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      64,
      {
        N: cost,
        r: blockSize,
        p: parallelization,
        maxmem: maxMemory
      },
      (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(derivedKey);
      }
    );
  });
}
