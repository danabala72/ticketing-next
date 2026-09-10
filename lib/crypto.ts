import { createCipheriv, createHash, randomBytes } from "node:crypto";
export function encryptSecret(value: string) {
  if (!value) return null;
  const source = process.env.AUTH_SECRET;
  if (!source) throw new Error("AUTH_SECRET belum dikonfigurasi.");
  const key = createHash("sha256").update(source).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv.toString("hex"), cipher.getAuthTag().toString("hex"), encrypted.toString("hex")].join(":");
}
