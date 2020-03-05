import { createSalt, scrypt, pbkdf2 } from "./crypt";

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
    // Hash generated using: https://www.browserling.com/tools/scrypt:
    // - Password: "password"
    // - Salt: "salt"
    // - Output size: 64
    // - N: 16384
    // - r: 8
    // - p: 1
    const password = "password";
    const salt = Buffer.from("salt");
    const hash = Buffer.from(
      "745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf7734ef9fd58422e2e22183bcacba9ec87ba0c83b7a2e788f03ce0da06463433cda6",
      "hex"
    );

    const passwordHash = await scrypt(password, salt);

    expect(passwordHash.toString("base64")).toEqual(hash.toString("base64"));
  });

  it("should return correct hash with custom parameters", async () => {
    // Hash generated using: https://www.browserling.com/tools/scrypt:
    // - Password: "password"
    // - Salt: "salt"
    // - Output size: 64
    // - N: 8192
    // - r: 4
    // - p: 2
    const password = "password";
    const salt = Buffer.from("salt");
    const hash = Buffer.from(
      "59b7fd911221b495d3494cff88169abfce684c705491024f706c76adb6be0dbbb56932a72823671f21690299d684c6ce5cf382b7da1c57be33c778e7a5e6ea0f",
      "hex"
    );

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
    // Hash generated using: https://stuff.birkenstab.de/pbkdf2/
    // - Message: "password"
    // - Salt: "salt"
    // - Iterations: 65536
    // - Key length: 64
    const password = "password";
    const salt = Buffer.from("salt");
    const hash = Buffer.from(
      "6f64c3f8023813d8c2cab43cabfaa65ed061822afe974060d8079d122fb869f420ee25bc999f352e482ab19583e9a6ae7cab7a9ba3e53b36a6f0d1a365a0aa40",
      "hex"
    );

    const passwordHash = await pbkdf2(password, salt);

    expect(passwordHash.toString("base64")).toEqual(hash.toString("base64"));
  });

  it("should return correct hash with custom parameters", async () => {
    // Hash generated using: https://stuff.birkenstab.de/pbkdf2/
    // - Message: "password"
    // - Salt: "salt"
    // - Iterations: 50000
    // - Key length: 64
    const password = "password";
    const salt = Buffer.from("salt");
    const iterations = 50000;
    const hash = Buffer.from(
      "337dbf33fe200d5c6d34340bd8eaac18285f43b6e46947efee3a4d54e8f2a32f06205be45d0901bdafe6eb598719105136e93670c13aef792479df4f1bd58af7",
      "hex"
    );

    const passwordHash = await pbkdf2(password, salt, iterations);

    expect(passwordHash.toString("base64")).toEqual(hash.toString("base64"));
  });
});
