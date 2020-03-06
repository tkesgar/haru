import { fromPassword, HaruMethod, HaruObject } from "..";
import {
  testSalt,
  testHashPbkdf2V1,
  testHashScryptV1
} from "../lib/test-fixtures";

describe("fromPassword", () => {
  it("should return Haru instance from password string (PBKDF2)", async () => {
    const haru = await fromPassword("password", HaruMethod.Pbkdf2);

    const { m } = haru.toJSON() as HaruObject;
    expect(m).toBe(HaruMethod.Pbkdf2);
  });

  it("should return Haru instance from password string (PBKDF2, custom salt)", async () => {
    const haru = await fromPassword("password", HaruMethod.Pbkdf2, testSalt);

    const { h } = haru.toJSON() as HaruObject;
    expect(h).toEqual(testHashPbkdf2V1.toString("base64"));
  });

  it("should return Haru instance from password string (scrypt)", async () => {
    const haru = await fromPassword("password", HaruMethod.Scrypt);

    const { m } = haru.toJSON() as HaruObject;
    expect(m).toBe(HaruMethod.Scrypt);
  });

  it("should return Haru instance from password string (scrypt, custom salt)", async () => {
    const haru = await fromPassword("password", HaruMethod.Scrypt, testSalt);

    const { h } = haru.toJSON() as HaruObject;
    expect(h).toEqual(testHashScryptV1.toString("base64"));
  });

  it("should use scrypt method by default", async () => {
    const haru = await fromPassword("password");

    const { m } = haru.toJSON() as HaruObject;
    expect(m).toBe(HaruMethod.Scrypt);
  });
});
