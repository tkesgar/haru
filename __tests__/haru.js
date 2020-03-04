/* eslint-env jest */
const Haru = require("..");

const TEST_PASS = "correct horse battery staple";
const TEST_SALT = Buffer.from("000000000000", "base64");
const TEST_COST = 1.2345;
const TEST_OBJ = {
  v: "HARU10",
  h:
    "cN9QYp+VDcW8pjIf+w05inv8kmwCarG7CFXRbbSJRh5+oE6Pv2al7Ma/7WKKsqW85LLZB1/9k93qna1WXGw2gA==",
  s: "000000000000",
  c: 1.2345
};
const TEST_STR =
  '{"v":"HARU10","h":"cN9QYp+VDcW8pjIf+w05inv8kmwCarG7CFXRbbSJRh5+oE6Pv2al7Ma/7WKKsqW85LLZB1/9k93qna1WXGw2gA==","s":"000000000000","c":1.2345}';

describe("static Haru.DEFAULT_COST", () => {
  it("should be used as default value for Haru.create()", async () => {
    const h = await Haru.create(TEST_PASS);
    expect(h.cost).toBe(Haru.DEFAULT_COST);
  });
});

describe("static Haru.create()", () => {
  describe("with defaults", () => {
    it("should return a new Haru instance", async () => {
      const h = await Haru.create(TEST_PASS);
      expect(h).toBeInstanceOf(Haru);
    });

    it("hash should match the provided password", async () => {
      const h = await Haru.create(TEST_PASS);
      expect(await h.test(TEST_PASS)).toBe(true);
    });
  });

  describe("with custom salt", () => {
    const salt = TEST_SALT;

    it("should return a new Haru instance", async () => {
      const h = await Haru.create(TEST_PASS, { salt });
      expect(h).toBeInstanceOf(Haru);
    });

    it("salt should match the provided salt", async () => {
      const h = await Haru.create(TEST_PASS, { salt });
      expect(h.salt.compare(salt)).toBe(0);
    });

    it("hash should match the provided password", async () => {
      const h = await Haru.create(TEST_PASS, { salt });
      expect(await h.test(TEST_PASS)).toBe(true);
    });
  });

  describe("with custom const", () => {
    const cost = TEST_COST;

    it("should return a new Haru instance", async () => {
      const h = await Haru.create(TEST_PASS, { cost });
      expect(h).toBeInstanceOf(Haru);
    });

    it("cost should match the provided cost", async () => {
      const h = await Haru.create(TEST_PASS, { cost });
      expect(h.cost).toBe(cost);
    });

    it("hash should match the provided password", async () => {
      const h = await Haru.create(TEST_PASS, { cost });
      expect(await h.test(TEST_PASS)).toBe(true);
    });
  });
});

describe("static Haru.from()", () => {
  describe("with object", () => {
    it("should return the Haru instance", async () => {
      const val = TEST_OBJ;

      const h = Haru.from(val);
      expect(h).toStrictEqual(await createTestInstance());
    });
  });

  describe("with string", () => {
    it("should return the Haru instance", async () => {
      const val = TEST_STR;

      const h = Haru.from(val);
      expect(h).toStrictEqual(await createTestInstance());
    });
  });
});

describe("static Haru.test()", () => {
  describe("with Haru instance", async () => {
    const val = await createTestInstance();

    expect(await Haru.test(val, TEST_PASS)).toBe(true);
  });

  describe("with non-Haru instance", async () => {
    const val = TEST_OBJ;

    expect(await Haru.test(val, TEST_PASS)).toBe(true);
  });
});

describe("Haru.test()", () => {
  it("should match the correct password", async () => {
    const h = await createTestInstance();
    expect(await h.test(TEST_PASS)).toBe(true);
  });

  it("should not match the wrong password", async () => {
    const h = await createTestInstance();
    expect(await h.test("Tr0ub4dor&3")).toBe(false);
  });
});

describe("Haru.toObject()", () => {
  it("should match the test object", async () => {
    const h = await createTestInstance();
    expect(h.toObject()).toEqual(TEST_OBJ);
  });
});

describe("Haru.toString()", () => {
  it("should match the test string", async () => {
    const h = await createTestInstance();
    expect(JSON.parse(h.toString())).toEqual(TEST_OBJ);
  });
});

describe("Haru.toJSON()", () => {
  it("should return the same output as toString()", async () => {
    const h = await createTestInstance();
    expect(h.toJSON()).toEqual(h.toString());
  });
});

function createTestInstance() {
  return Haru.create(TEST_PASS, { salt: TEST_SALT, cost: TEST_COST });
}
