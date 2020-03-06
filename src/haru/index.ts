import { timingSafeEqual } from "crypto";

export enum HaruMethod {
  Pbkdf2 = 1,
  Scrypt = 2
}

export type HaruPbkdf2Params = [number];

export type HaruScryptParams = [number, number, number, number];

export interface HaruObject<P = HaruPbkdf2Params | HaruScryptParams> {
  v: "HARU20";
  h: string;
  s: string;
  m: HaruMethod;
  p: P;
}

export interface HaruConstructorOpts {
  hash: Buffer;
  salt: Buffer;
}

export default abstract class Haru {
  protected hash: Buffer;
  protected salt: Buffer;

  constructor(opts: HaruConstructorOpts) {
    const { hash, salt } = opts;

    this.hash = hash;
    this.salt = salt;
  }

  abstract async computeHash(password: string): Promise<Buffer>;

  abstract toJSON(): HaruObject;

  async test(password: string): Promise<boolean> {
    const passwordHash = await this.computeHash(password);

    return timingSafeEqual(this.hash, passwordHash);
  }
}
