import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const appName = process.argv[2]; 
const mode = process.argv[3] || 'dev'; 

if (!appName) {
  console.error("❌ Please provide an app name! Example: npm run app:dev music");
  process.exit(1);
}

const manifestPath = path.resolve('hyper.apps.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const config = manifest[appName];

if (!config) {
  console.error(`❌ App '${appName}' not found in hyper.apps.json!`);
  process.exit(1);
}

// Default version agar manifest mein miss ho jaye
const appVersion = config.version || "1.0.0";
console.log(`🚀 Starting ${config.name} (v${appVersion}) in ${mode} mode...`);

const baseTauriConfig = {
  "$schema": "https://schema.tauri.app/config/2",
  "productName": config.name,
  "version": appVersion, // 🔥 Version ab yahan se uthega
  "identifier": config.identifier,
  "build": {
    "beforeDevCommand": `cross-env VITE_APP_TARGET=${appName} VITE_SERVER_PORT=${config.port} vite`,
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": `cross-env VITE_APP_TARGET=${appName} VITE_SERVER_PORT=${config.port} vite build`,
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [{ "title": config.name, "width": config.windowWidth, "height": config.windowHeight }],
    "security": { "csp": null, "assetProtocol": { "enable": true, "scope": ["**/*"] } }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
  }
};

const configPath = path.resolve(`src-tauri/tauri.${appName}.conf.json`);
fs.writeFileSync(configPath, JSON.stringify(baseTauriConfig, null, 2));

const tauriCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const tauriArgs = [
  'tauri', mode, 
  '--config', `src-tauri/tauri.${appName}.conf.json`,
  '--features', config.featureFlag,
  '--', '--no-default-features'
];

const env = { 
  ...process.env, 
  HYPER_PORT: config.port.toString(),
  VITE_APP_TARGET: appName,
  VITE_SERVER_PORT: config.port.toString()
};

const child = spawn(tauriCmd, tauriArgs, { 
  env, 
  stdio: 'inherit',
  shell: true 
});

child.on('close', (code) => {
  console.log(`✅ Process exited with code ${code}`);
  
  // 🔥 THE MAGIC: Agar build mode tha aur successful raha, toh files organize karo!
  if (mode === 'build' && code === 0) {
    console.log(`📦 Organizing release files for ${config.name}...`);
    
    // Naya folder structure: releases/HyperVideo/v1.0.0/
    const releaseDir = path.resolve(`releases/${config.name}/v${appVersion}`);
    if (!fs.existsSync(releaseDir)) {
      fs.mkdirSync(releaseDir, { recursive: true });
    }

    const tauriTarget = path.resolve('src-tauri/target/release');
    
    // 1. Direct Portable EXE copy karna
    const rawExe = path.join(tauriTarget, `${config.name}.exe`);
    if (fs.existsSync(rawExe)) {
      fs.copyFileSync(rawExe, path.join(releaseDir, `${config.name}-Portable.exe`));
      console.log(`   -> Copied Portable Exe`);
    }

    // 2. Setup Installer (NSIS) copy karna
    const bundleDir = path.join(tauriTarget, 'bundle', 'nsis');
    if (fs.existsSync(bundleDir)) {
      const files = fs.readdirSync(bundleDir);
      const setupFile = files.find(f => f.startsWith(config.name) && f.endsWith('-setup.exe'));
      if (setupFile) {
        fs.copyFileSync(path.join(bundleDir, setupFile), path.join(releaseDir, setupFile));
        console.log(`   -> Copied Installer Setup`);
      }
    }
    
    console.log(`🎉 Build successfully saved to: ${releaseDir}`);
  }
});