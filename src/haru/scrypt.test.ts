import HaruScrypt, { HaruScryptParams } from "./scrypt";
import { HaruMethod, HaruObject } from ".";
import {
  testHashScryptV1,
  testHashScryptV2,
  testSalt
} from "../lib/test-fixtures";

const testHaruObject: HaruObject<HaruScryptParams> = {
  v: "HARU20",
  h: testHashScryptV1.toString("base64"),
  s: testSalt.toString("base64"),
  m: HaruMethod.Scrypt,
  p: [16384, 8, 1, 33554432]
};

describe("fromObject", () => {
  it("should return HaruScrypt instance from Haru object", async () => {
    const haru = HaruScrypt.fromObject(testHaruObject);

    expect(await haru.test("password")).toBe(true);
  });
});

describe("fromPassword", () => {
  it("should return HaruScrypt instance from password", async () => {
    const haru = await HaruScrypt.fromPassword("password");

    expect(await haru.test("password")).toBe(true);
    expect(await haru.test("drowssap")).toBe(false);
  });

  it("should return HaruScrypt instance from password with custom salt", async () => {
    const haru = await HaruScrypt.fromPassword("password", testSalt);

    const passwordHash = await haru.computeHash("password");
    expect(passwordHash.toString("base64")).toEqual(
      testHashScryptV1.toString("base64")
    );
  });

  it("should return HaruScrypt instance with custom salt and iterations", async () => {
    const haru = await HaruScrypt.fromPassword("password", testSalt, {
      cost: 8192,
      blockSize: 4,
      parallelization: 2,
      maxMemory: 128 * 8192 * 4 * 2
    });

    const passwordHash = await haru.computeHash("password");
    expect(passwordHash.toString("base64")).toEqual(
      testHashScryptV2.toString("base64")
    );
  });
});

describe("toJSON", () => {
  it("should return Haru object", () => {
    const haru = HaruScrypt.fromObject(testHaruObject);

    expect(haru.toJSON()).toEqual(testHaruObject);
  });
});
