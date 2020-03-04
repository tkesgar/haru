import Haru, { HaruObject, HaruMethod } from "./haru";
import HaruPbkdf2, { HaruPbkdf2Params } from "./haru-pbkdf2";
import HaruScrypt, { HaruScryptParams } from "./haru-scrypt";

export interface Haru10Object {
  v: "HARU10";
  h: string;
  s: string;
  c: number;
}

/**
 * Creates a new `Haru` instance from the provided `Haru` object.
 *
 * Please note that the object is assumed to be a valid (matches the `Haru` object specification) and correct (has correct hash, salt, and parameter values).
 *
 * @param obj A `Haru` object
 */
export function fromObject(obj: HaruObject): Haru {
  const { m } = obj;

  switch (m) {
    case HaruMethod.Pbkdf2:
      return HaruPbkdf2.fromObject(obj as HaruObject<HaruPbkdf2Params>);
    case HaruMethod.Scrypt:
      return HaruScrypt.fromObject(obj as HaruObject<HaruScryptParams>);
    default:
      throw new Error(`Unknown m: ${m}`);
  }
}

/**
 * Creates a new `Haru` instance from the provided JSON string.
 *
 * This method is a shorthand for `fromObject(JSON.parse(json))`.
 *
 * @param json JSON string that represents a `Haru` object
 */
export function fromJSON(json: string): Haru {
  return fromObject(JSON.parse(json));
}

/**
 * Creates a new `Haru` instance from the provided `password`.
 *
 * This method does not allow the hash parameters for the method to be customized.
 * If you need to provide custom parameters (e.g. custom iteration count for PBKDF2),
 * you should use the respective `fromPassword` static method instead
 * (`HaruPbkdf2.fromPassword` and `HaruScrypt.fromPassword` for PBKDF2 and scrypt, respectively).
 *
 * @param method Method to compute the hash
 * @param password Password for the hash
 * @param salt Optional salt buffer to be used for computing the hash
 */
export async function fromPassword(
  method: HaruMethod,
  password: string,
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

/**
 * Tests a `Haru` object against `password`.
 * Resolves with `true` if `password` matches, otherwise resolves with `false`.
 *
 * This method is a shorthand for creating the Haru instance and calling `test` method with `password`.
 *
 * @param value Value to be tested
 * @param password Password to be tested
 */
export async function test(
  value: HaruObject,
  password: string
): Promise<boolean>;

/**
 * Tests a JSON string representing a `Haru` object against `password`.
 *
 * Resolves with `true` if `password` matches, otherwise resolves with `false`.
 *
 * This method is a shorthand for creating the Haru instance and calling `test` method with `password`.
 *
 * @param value Value to be tested
 * @param password Password to be tested
 */
export async function test(value: string, password: string): Promise<boolean>;

export async function test(
  value: string | HaruObject,
  password: string
): Promise<boolean> {
  const haru = typeof value === "string" ? fromJSON(value) : fromObject(value);

  return haru.test(password);
}

/**
 * Utility function to convert a `HARU10` object to `HARU20` object.
 *
 * There are no hash recomputations involved; the hash value, salt, and cost parameter is used as-is.
 *
 * @param haru10Object A `Haru` object instance (version `HARU10`)
 */
export function haru10toHaru20(haru10Object: Haru10Object): HaruObject {
  const { h, s, c } = haru10Object;

  const iterations = Math.floor(c * 10000);

  return {
    v: "HARU20",
    h,
    s,
    m: HaruMethod.Pbkdf2,
    p: [iterations]
  };
}

export { default as HaruPbkdf2 } from "./haru-pbkdf2";

export { default as HaruScrypt } from "./haru-scrypt";
