import { fromJSON, HaruMethod } from "..";
import { testSalt, testHashPbkdf2V1 } from "../lib/test-fixtures";

describe("fromJSON", () => {
  it("should return Haru instance from Haru object JSON", async () => {
    const json = JSON.stringify({
      v: "HARU20",
      h: testHashPbkdf2V1.toString("base64"),
      s: testSalt.toString("base64"),
      m: HaruMethod.Pbkdf2,
      p: [65536],
    });

    const haru = fromJSON(json);

    expect(await haru.test("password")).toBe(true);
  });
});
