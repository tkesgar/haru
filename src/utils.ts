import Haru, { HaruObject, HaruMethod } from "./haru";
import HaruPbkdf2, { HaruPbkdf2Params } from "./haru/pbkdf2";
import HaruScrypt, { HaruScryptParams } from "./haru/scrypt";

export interface Haru10Object {
  v: "HARU10";
  h: string;
  s: string;
  c: number;
}

export function fromObject(obj: object): Haru {
  const { m } = obj as HaruObject;

  switch (m) {
    case HaruMethod.Pbkdf2:
      return HaruPbkdf2.fromObject(obj as HaruObject<HaruPbkdf2Params>);
    case HaruMethod.Scrypt:
      return HaruScrypt.fromObject(obj as HaruObject<HaruScryptParams>);
    default:
      throw new Error(`Unknown m: ${m}`);
  }
}

export function fromJSON(json: string): Haru {
  return fromObject(JSON.parse(json));
}

export async function fromPassword(
  password: string,
  method = HaruMethod.Scrypt,
  salt?: Buffer
): Promise<Haru> {
  switch (method) {
    case HaruMethod.Pbkdf2:
      return HaruPbkdf2.fromPassword(password, salt);
    case HaruMethod.Scrypt:
      return HaruScrypt.fromPassword(password, salt);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

export async function test(value: string, password: string): Promise<boolean>;
export async function test(value: object, password: string): Promise<boolean>;
export async function test(value: unknown, password: string): Promise<boolean> {
  const haru =
    typeof value === "string"
      ? fromJSON(value)
      : fromObject(value as HaruObject);

  return haru.test(password);
}

export function haru10to20(haru10Object: object): HaruObject {
  const { h, s, c } = haru10Object as Haru10Object;

  const iterations = Math.floor(c * 10000);

  return {
    v: "HARU20",
    h,
    s,
    m: HaruMethod.Pbkdf2,
    p: [iterations]
  };
}
