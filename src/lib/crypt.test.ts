import { createSalt, scrypt, pbkdf2 } from "./crypt";
import {
  testSalt,
  testHashScryptV1,
  testHashScryptV2,
  testHashPbkdf2V1,
  testHashPbkdf2V2
} from "../lib/test-fixtures";

describe("createSalt", () => {
  it("should return salt with length 16 bytes (default)", () => {
    const salt = createSalt();
    expect(salt.length).toBe(16);
  });

  it("should return salt with length 24 bytes", () => {
    const salt = createSalt(24);
    expect(salt.length).toBe(24);
  });
});

describe("scrypt", () => {
  it("should return correct hash with default parameters", async () => {
    const password = "password";
    const salt = testSalt;
    const hash = testHashScryptV1;

    const passwordHash = await scrypt(password, salt);

    expect(passwordHash.toString("base64")).toEqual(hash.toString("base64"));
  });

  it("should return correct hash with custom parameters", async () => {
    const password = "password";
    const salt = testSalt;
    const hash = testHashScryptV2;

    const passwordHash = await scrypt(password, salt, {
      cost: 8192,
      blockSize: 4,
      parallelization: 2,
      maxMemory: 128 * 8192 * 4 * 2
    });

    expect(passwordHash.toString("base64")).toEqual(hash.toString("base64"));
  });
});

describe("pbkdf2", () => {
  it("should return correct hash with default parameters", async () => {
    const password = "password";
    const salt = testSalt;
    const hash = testHashPbkdf2V1;

    const passwordHash = await pbkdf2(password, salt);

    expect(passwordHash.toString("base64")).toEqual(hash.toString("base64"));
  });

  it("should return correct hash with custom parameters", async () => {
    const password = "password";
    const salt = testSalt;
    const iterations = 10000;
    const hash = testHashPbkdf2V2;

    const passwordHash = await pbkdf2(password, salt, iterations);

    expect(passwordHash.toString("base64")).toEqual(hash.toString("base64"));
  });
});
