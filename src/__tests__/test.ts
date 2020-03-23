import { test, HaruMethod } from "..";
import { testHashScryptV1, testSalt } from "../lib/test-fixtures";

describe("test", () => {
  it("should return true with value = string", async () => {
    const value = JSON.stringify({
      v: "HARU20",
      h: testHashScryptV1,
      s: testSalt,
      m: HaruMethod.Scrypt,
      p: [16384, 8, 1, 33554432],
    });

    expect(await test(value, "password")).toBe(true);
  });

  it("should return true with value = Haru object", async () => {
    const value = {
      v: "HARU20",
      h: testHashScryptV1,
      s: testSalt,
      m: HaruMethod.Scrypt,
      p: [16384, 8, 1, 33554432],
    };

    expect(await test(value, "password")).toBe(true);
  });

  it("should return false because password does not match", async () => {
    const value = {
      v: "HARU20",
      h: testHashScryptV1,
      s: testSalt,
      m: HaruMethod.Scrypt,
      p: [16384, 8, 1, 33554432],
    };

    expect(await test(value, "drowssap")).toBe(false);
  });
});
