import { fromObject, fromJSON, HaruMethod } from ".";
import {
  testSalt,
  testHashPbkdf2V1,
  testHashScryptV1,
  testHashPbkdf2V2
} from "./lib/test-fixtures";
import { fromPassword, test, haru10to20 } from "./utils";
import { HaruObject } from "./haru";
import { HaruScryptParams } from "./haru/scrypt";

describe("fromObject", () => {
  it("should return Haru instance from Haru object with m = 1 (PBKDF2)", async () => {
    const haru = fromObject({
      v: "HARU20",
      h: testHashPbkdf2V1.toString("base64"),
      s: testSalt.toString("base64"),
      m: HaruMethod.Pbkdf2,
      p: [65536]
    });

    expect(await haru.test("password")).toBe(true);
  });

  it("should return Haru instance from Haru object with m = 2 (scrypt)", async () => {
    const haru = fromObject({
      v: "HARU20",
      h: testHashScryptV1.toString("base64"),
      s: testSalt.toString("base64"),
      m: HaruMethod.Scrypt,
      p: [16384, 8, 1, 33554432]
    });

    expect(await haru.test("password")).toBe(true);
  });

  it("should throw if m is invalid", () => {
    expect(() => {
      fromObject({
        v: "HARU20",
        h: testHashScryptV1.toString("base64"),
        s: testSalt.toString("base64"),
        m: 3,
        p: [16384, 8, 1, 33554432]
      });
    }).toThrowError("Unknown m: 3");
  });
});

describe("fromJSON", () => {
  it("should return Haru instance from Haru object JSON", async () => {
    const json = JSON.stringify({
      v: "HARU20",
      h: testHashPbkdf2V1.toString("base64"),
      s: testSalt.toString("base64"),
      m: HaruMethod.Pbkdf2,
      p: [65536]
    });

    const haru = fromJSON(json);

    expect(await haru.test("password")).toBe(true);
  });
});

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

describe("test", () => {
  it("should return true with value = string", async () => {
    const value = JSON.stringify({
      v: "HARU20",
      h: testHashScryptV1,
      s: testSalt,
      m: HaruMethod.Scrypt,
      p: [16384, 8, 1, 33554432]
    });

    expect(await test(value, "password")).toBe(true);
  });

  it("should return true with value = Haru object", async () => {
    const value = {
      v: "HARU20",
      h: testHashScryptV1,
      s: testSalt,
      m: HaruMethod.Scrypt,
      p: [16384, 8, 1, 33554432]
    };

    expect(await test(value, "password")).toBe(true);
  });

  it("should return false because password does not match", async () => {
    const value = {
      v: "HARU20",
      h: testHashScryptV1,
      s: testSalt,
      m: HaruMethod.Scrypt,
      p: [16384, 8, 1, 33554432]
    };

    expect(await test(value, "drowssap")).toBe(false);
  });
});

describe("haru10to20", () => {
  it("should convert HARU10 to HARU20 object", async () => {
    const haru10obj = {
      v: "HARU10",
      h: testHashPbkdf2V2,
      s: testSalt,
      c: 1
    };

    const haru20obj = haru10to20(haru10obj);

    expect(await test(haru20obj, "password")).toBe(true);
  });
});
