import HaruPbkdf2, { HaruPbkdf2Params } from "./pbkdf2";
import { HaruMethod, HaruObject } from ".";
import {
  testHashPbkdf2V1,
  testHashPbkdf2V2,
  testSalt
} from "../lib/test-fixtures";

const testHaruObject: HaruObject<HaruPbkdf2Params> = {
  v: "HARU20",
  h: testHashPbkdf2V1.toString("base64"),
  s: testSalt.toString("base64"),
  m: HaruMethod.Pbkdf2,
  p: [65536]
};

describe("fromObject", () => {
  it("should return HaruPbkdf2 instance from Haru object", async () => {
    const haru = HaruPbkdf2.fromObject(testHaruObject);

    expect(await haru.test("password")).toBe(true);
  });
});

describe("fromPassword", () => {
  it("should return HaruPbkdf2 instance from password", async () => {
    const haru = await HaruPbkdf2.fromPassword("password");

    expect(await haru.test("password")).toBe(true);
    expect(await haru.test("drowssap")).toBe(false);
  });

  it("should return HaruPbkdf2 instance from password with custom salt", async () => {
    const haru = await HaruPbkdf2.fromPassword("password", testSalt);

    const passwordHash = await haru.computeHash("password");
    expect(passwordHash.toString("base64")).toEqual(
      testHashPbkdf2V1.toString("base64")
    );
  });

  it("should return HaruPbkdf2 instance with custom salt and iterations", async () => {
    const haru = await HaruPbkdf2.fromPassword("password", testSalt, 10000);

    const passwordHash = await haru.computeHash("password");
    expect(passwordHash.toString("base64")).toEqual(
      testHashPbkdf2V2.toString("base64")
    );
  });
});

describe("toJSON", () => {
  it("should return Haru object", () => {
    const haru = HaruPbkdf2.fromObject(testHaruObject);

    expect(haru.toJSON()).toEqual(testHaruObject);
  });
});
