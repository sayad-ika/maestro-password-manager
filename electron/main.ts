import { app, BrowserWindow, ipcMain } from "electron";
import { encrypt } from "./crypto";
import { loadVault, saveVault, getOrCreateSalt } from "./store";
import { deriveMasterKey } from "./kdf";

let masterKey: Buffer | null = null;

ipcMain.handle("init", async (_, password: string) => {
  const salt = getOrCreateSalt();
  masterKey = await deriveMasterKey(password, salt);
  return true;
});

ipcMain.handle("add-entry", (_, entry) => {
  if (!masterKey) throw new Error("Vault not initialized");
  const vault = loadVault();
  vault.push(encrypt(JSON.stringify(entry), masterKey));
  saveVault(vault);
});

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: __dirname + "/preload.js",
    },
  });

  win.loadURL(process.env.VITE_DEV_SERVER_URL!);
}

app.whenReady().then(createWindow);
