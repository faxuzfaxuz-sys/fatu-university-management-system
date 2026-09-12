const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const path = require("path");

const PORT = 3199;
let serverProcess = null;
let mainWindow = null;

function configPath() {
  return path.join(app.getPath("userData"), "config.env");
}

function ensureConfigFile() {
  const target = configPath();
  if (!fs.existsSync(target)) {
    const template = path.join(process.resourcesPath, "config.example.env");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(template, target);
  }
  return target;
}

function readEnvFile(filePath) {
  const values = {};
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    values[key] = value;
  }
  return values;
}

function waitForServer(port, timeoutMs = 30000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const socket = net.createConnection({ host: "127.0.0.1", port });
      socket.once("connect", () => {
        socket.destroy();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("Ichki serverni ishga tushirish vaqti tugadi."));
        } else {
          setTimeout(check, 250);
        }
      });
    };
    check();
  });
}

async function startServer() {
  const envFile = ensureConfigFile();
  const config = readEnvFile(envFile);
  if (!config.DATABASE_URL || !config.JWT_SECRET || config.JWT_SECRET.startsWith("change-this")) {
    throw new Error(
      `Avval PostgreSQL va JWT_SECRET ni sozlang:\n${envFile}`
    );
  }

  const appRoot = path.join(process.resourcesPath, "app");
  const nextCli = path.join(appRoot, "node_modules", "next", "dist", "bin", "next");
  serverProcess = spawn(process.execPath, [nextCli, "start", "--port", String(PORT), "--hostname", "127.0.0.1"], {
    cwd: appRoot,
    windowsHide: true,
    env: {
      ...process.env,
      ...config,
      NODE_ENV: "production",
      PORT: String(PORT),
      HOSTNAME: "127.0.0.1",
      ELECTRON_RUN_AS_NODE: "1",
    },
  });

  serverProcess.on("error", (error) => {
    dialog.showErrorBox("FATU server xatosi", error.message);
  });

  await waitForServer(PORT);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    title: "FATU University Portal",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
}

app.whenReady().then(async () => {
  try {
    await startServer();
    createWindow();
  } catch (error) {
    dialog.showErrorBox("FATU sozlamalari kerak", error.message);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
});