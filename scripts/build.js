import fs from 'fs';
import { spawn, execSync } from 'child_process';
import path from 'path';

// 🚀 Naye Arguments
const appName = process.argv[2]; 
const action = process.argv[3] || 'dev'; 
const platform = process.argv[4] || 'desktop'; 

if (!appName) {
  console.error("❌ Please provide an app name! Example: node scripts/build.js video build android");
  process.exit(1);
}

const manifestPath = path.resolve('hyper.apps.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const config = manifest[appName];

if (!config) {
  console.error(`❌ App '${appName}' not found in hyper.apps.json!`);
  process.exit(1);
}

const appVersion = config.version || "1.0.0";
console.log(`🚀 Starting ${config.name} (v${appVersion}) for ${platform.toUpperCase()} in ${action.toUpperCase()} mode...`);

const baseTauriConfig = {
  "$schema": "https://schema.tauri.app/config/2",
  "productName": config.name,
  "version": appVersion,
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
const env = { 
  ...process.env, 
  HYPER_PORT: config.port.toString(),
  VITE_APP_TARGET: appName,
  VITE_SERVER_PORT: config.port.toString()
};

// 🔥 NAYA JAADU: Android Folder Auto-Sync 🔥
// Yeh logic check karega ki naye app ka package folder bana hai ya nahi.
if (platform === 'android') {
  const packagePath = config.identifier.split('.').join('/'); // "com.abhi.music" -> "com/abhi/music"
  const expectedDir = path.resolve(`src-tauri/gen/android/app/src/main/java/${packagePath}`);
  
  if (!fs.existsSync(expectedDir)) {
    console.log(`\n🔄 App switch detected! Rebuilding Android structure for '${config.identifier}'...`);
    
    const genDir = path.resolve('src-tauri/gen/android');
    if (fs.existsSync(genDir)) {
      fs.rmSync(genDir, { recursive: true, force: true });
    }
    
    try {
      execSync(`${tauriCmd} tauri android init --config src-tauri/tauri.${appName}.conf.json`, { stdio: 'inherit', env });
      console.log(`✅ Android structure re-initialized!\n`);
    } catch (e) {
      console.error(`❌ Failed to initialize Android structure.`);
      process.exit(1);
    }
  }
}

// Command setup
let tauriArgs = ['tauri'];
if (platform === 'android') {
  tauriArgs.push('android');
}
tauriArgs.push(action, '--config', `src-tauri/tauri.${appName}.conf.json`, '--features', config.featureFlag, '--', '--no-default-features');

const child = spawn(tauriCmd, tauriArgs, { 
  env, 
  stdio: 'inherit',
  shell: process.platform === 'win32' // Warning fix
});

// 📂 Recursive file finder helper
function findFiles(dir, ext, fileList = []) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        findFiles(filePath, ext, fileList);
      } else if (filePath.endsWith(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

child.on('close', (code) => {
  console.log(`\n✅ Process exited with code ${code}`);
  
  if (action === 'build' && code === 0) {
    console.log(`📦 Organizing release files for ${config.name} (${platform.toUpperCase()})...`);
    
    const releaseDir = path.resolve(`releases/${config.name}/v${appVersion}/${platform}`);
    if (!fs.existsSync(releaseDir)) {
      fs.mkdirSync(releaseDir, { recursive: true });
    }

    if (platform === 'desktop') {
      const tauriTarget = path.resolve('src-tauri/target/release');
      
      const rawExe = path.join(tauriTarget, `${config.name}.exe`);
      if (fs.existsSync(rawExe)) {
        fs.copyFileSync(rawExe, path.join(releaseDir, `${config.name}-Portable.exe`));
        console.log(`   -> Copied Desktop Portable Exe`);
      }

      const bundleDir = path.join(tauriTarget, 'bundle', 'nsis');
      if (fs.existsSync(bundleDir)) {
        const files = fs.readdirSync(bundleDir);
        const setupFile = files.find(f => f.startsWith(config.name) && f.endsWith('-setup.exe'));
        if (setupFile) {
          fs.copyFileSync(path.join(bundleDir, setupFile), path.join(releaseDir, setupFile));
          console.log(`   -> Copied Desktop Installer Setup`);
        }
      }
    } 
    else if (platform === 'android') {
       // Android folders jahan APK aur AAB bante hain
       const apkDir = path.resolve('src-tauri/gen/android/app/build/outputs/apk');
       const aabDir = path.resolve('src-tauri/gen/android/app/build/outputs/bundle');
       
       const apkFiles = findFiles(apkDir, '.apk');
       apkFiles.forEach(file => {
          const fileName = path.basename(file);
          const newName = `${config.name}-v${appVersion}-${fileName}`;
          fs.copyFileSync(file, path.join(releaseDir, newName));
          console.log(`   -> Copied APK: ${newName}`);
       });

       const aabFiles = findFiles(aabDir, '.aab');
       aabFiles.forEach(file => {
          const fileName = path.basename(file);
          const newName = `${config.name}-v${appVersion}-${fileName}`;
          fs.copyFileSync(file, path.join(releaseDir, newName));
          console.log(`   -> Copied AAB (PlayStore Bundle): ${newName}`);
       });
    }
    
    console.log(`\n🎉 Build successfully saved to: ${releaseDir}`);
  }
});