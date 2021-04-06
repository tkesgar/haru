import { HaruMethod, fromPassword, fromJSON } from "..";

describe("test", () => {
  it.each([
    ["password", HaruMethod.Pbkdf2],
    ["password", HaruMethod.Scrypt],
    ["password~!@#$%^&*()_+", HaruMethod.Pbkdf2],
    ["password~!@#$%^&*()_+", HaruMethod.Scrypt],
    ["password~!@#$%^&*()_+`1234567890", HaruMethod.Pbkdf2],
    ["password~!@#$%^&*()_+`1234567890", HaruMethod.Scrypt],
    ["password~!@#$%^&*()_+`1234567890{}:\"<>?,./;'[]", HaruMethod.Pbkdf2],
    ["password~!@#$%^&*()_+`1234567890{}:\"<>?,./;'[]", HaruMethod.Scrypt],
    ["👨👨👧👧", HaruMethod.Pbkdf2],
    ["👨👨👧👧", HaruMethod.Scrypt],
  ])(
    "should correctly serialize and deserialize password with password = %s",
    async (password, method) => {
      const json = JSON.stringify(await fromPassword(password, method));
      const haru = await fromJSON(json);

      expect(await haru.test(password)).toBe(true);
    }
  );
});
