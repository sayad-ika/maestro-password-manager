import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { app } from "electron";

const DATA_DIR = app.getPath("userData");
const VAULT_PATH = path.join(DATA_DIR, "vault.json");
const SALT_PATH = path.join(DATA_DIR, "salt.bin");

export function getOrCreateSalt(): Buffer {
  if (!fs.existsSync(SALT_PATH)) {
    const salt = crypto.randomBytes(16);
    fs.writeFileSync(SALT_PATH, salt);
    return salt;
  }
  return fs.readFileSync(SALT_PATH);
}

export function loadVault(): any[] {
  if (!fs.existsSync(VAULT_PATH)) return [];
  return JSON.parse(fs.readFileSync(VAULT_PATH, "utf8"));
}

export function saveVault(vault: any[]) {
  fs.writeFileSync(VAULT_PATH, JSON.stringify(vault, null, 2));
}
