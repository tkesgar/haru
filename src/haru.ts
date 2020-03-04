import { timingSafeEqual } from "crypto";

export enum HaruMethod {
  Pbkdf2 = 1,
  Scrypt = 2
}

export interface HaruObject<P = unknown> {
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

  protected abstract async computeHash(password: string): Promise<Buffer>;

  abstract toJSON(): object;

  async test(password: string): Promise<boolean> {
    const passwordHash = await this.computeHash(password);

    return timingSafeEqual(this.hash, passwordHash);
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
