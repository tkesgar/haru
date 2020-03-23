import { pbkdf2, createSalt, DEFAULT_PBKDF2_ITERATIONS } from "../lib/crypt";
import Haru, {
  HaruConstructorOpts,
  HaruMethod,
  HaruObject,
  HaruPbkdf2Params,
} from ".";

interface HaruPbkdf2ConstructorOpts extends HaruConstructorOpts {
  iterations: number;
}

export default class HaruPbkdf2 extends Haru {
  static fromObject(obj: HaruObject<HaruPbkdf2Params>): HaruPbkdf2 {
    const { h, s, p } = obj;

    const hash = Buffer.from(h, "base64");
    const salt = Buffer.from(s, "base64");
    const [iterations] = p;

    return new HaruPbkdf2({ hash, salt, iterations });
  }

  static async fromPassword(
    password: string,
    salt = createSalt(),
    iterations = DEFAULT_PBKDF2_ITERATIONS
  ): Promise<HaruPbkdf2> {
    const hash = await pbkdf2(password, salt, iterations);

    return new HaruPbkdf2({ hash, salt, iterations });
  }

  private iterations: number;

  constructor(opts: HaruPbkdf2ConstructorOpts) {
    super(opts);

    const { iterations } = opts;

    this.iterations = iterations;
  }

  async computeHash(password: string): Promise<Buffer> {
    return pbkdf2(password, this.salt, this.iterations);
  }

  toJSON(): HaruObject<HaruPbkdf2Params> {
    return {
      v: "HARU20",
      h: this.hash.toString("base64"),
      s: this.salt.toString("base64"),
      m: HaruMethod.Pbkdf2,
      p: [this.iterations],
    };
  }
}
