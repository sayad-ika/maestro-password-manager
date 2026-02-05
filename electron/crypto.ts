import * as crypto from "crypto";

const ALGO = "aes-256-gcm";

export function encrypt(plaintext: string, key: Buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    tag: cipher.getAuthTag().toString("hex"),
  };
}

export function decrypt(payload: any, key: Buffer) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    key,
    Buffer.from(payload.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

  return (
    decipher.update(Buffer.from(payload.content, "hex")) +
    decipher.final("utf8")
  );
}
