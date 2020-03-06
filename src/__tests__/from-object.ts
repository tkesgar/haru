import { fromObject, HaruMethod } from "..";
import {
  testSalt,
  testHashPbkdf2V1,
  testHashScryptV1
} from "../lib/test-fixtures";

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
