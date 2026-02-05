import * as argon2 from "argon2";

const ARGON_OPTIONS: argon2.Options & { raw: true } = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 3,
  parallelism: 1,
  hashLength: 32,
  raw: true,
};

export async function deriveMasterKey(
  password: string,
  salt: Buffer
): Promise<Buffer> {
  return (await argon2.hash(password, {
    ...ARGON_OPTIONS,
    salt,
  })) as Buffer;
}
