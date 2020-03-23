import { haru10to20, test } from "..";
import { testHashPbkdf2V2, testSalt } from "../lib/test-fixtures";

describe("haru10to20", () => {
  it("should convert HARU10 to HARU20 object", async () => {
    const haru10obj = {
      v: "HARU10",
      h: testHashPbkdf2V2,
      s: testSalt,
      c: 1,
    };

    const haru20obj = haru10to20(haru10obj);

    expect(await test(haru20obj, "password")).toBe(true);
  });
});
