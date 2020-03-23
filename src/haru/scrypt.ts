import {
  scrypt,
  createSalt,
  ScryptOptions,
  DEFAULT_SCRYPT_COST,
  DEFAULT_SCRYPT_BLOCK_SIZE,
  DEFAULT_SCRYPT_PARALLELIZATION,
  DEFAULT_SCRYPT_MAX_MEMORY,
} from "../lib/crypt";
import Haru, {
  HaruConstructorOpts,
  HaruMethod,
  HaruObject,
  HaruScryptParams,
} from ".";

interface HaruScryptConstructorOpts extends HaruConstructorOpts {
  cost: number;
  blockSize: number;
  parallelization: number;
  maxMemory: number;
}

export default class HaruScrypt extends Haru {
  static fromObject(obj: HaruObject<HaruScryptParams>): HaruScrypt {
    const { h, s, p } = obj;

    const hash = Buffer.from(h, "base64");
    const salt = Buffer.from(s, "base64");
    const [cost, blockSize, parallelization, maxMemory] = p;

    return new HaruScrypt({
      hash,
      salt,
      cost,
      blockSize,
      parallelization,
      maxMemory,
    });
  }

  static async fromPassword(
    password: string,
    salt = createSalt(),
    opts: ScryptOptions = {}
  ): Promise<HaruScrypt> {
    const {
      cost = DEFAULT_SCRYPT_COST,
      blockSize = DEFAULT_SCRYPT_BLOCK_SIZE,
      parallelization = DEFAULT_SCRYPT_PARALLELIZATION,
      maxMemory = DEFAULT_SCRYPT_MAX_MEMORY,
    } = opts;

    const hash = await scrypt(password, salt, {
      cost,
      blockSize,
      parallelization,
      maxMemory,
    });

    return new HaruScrypt({
      hash,
      salt,
      cost,
      blockSize,
      parallelization,
      maxMemory,
    });
  }

  private cost: number;
  private blockSize: number;
  private parallelization: number;
  private maxMemory: number;

  constructor(opts: HaruScryptConstructorOpts) {
    super(opts);

    const { cost, blockSize, parallelization, maxMemory } = opts;

    this.cost = cost;
    this.blockSize = blockSize;
    this.parallelization = parallelization;
    this.maxMemory = maxMemory;
  }

  async computeHash(password: string): Promise<Buffer> {
    return scrypt(password, this.salt, {
      cost: this.cost,
      blockSize: this.blockSize,
      parallelization: this.parallelization,
      maxMemory: this.maxMemory,
    });
  }

  toJSON(): HaruObject<HaruScryptParams> {
    return {
      v: "HARU20",
      h: this.hash.toString("base64"),
      s: this.salt.toString("base64"),
      m: HaruMethod.Scrypt,
      p: [this.cost, this.blockSize, this.parallelization, this.maxMemory],
    };
  }
}
