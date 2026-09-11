import 'dotenv/config'; 
import fs from 'fs';
import { spawn, execSync } from 'child_process';
import path from 'path';

// ==========================================
// 🛠️ PHASE 1: CONFIGURATION & SETUP
// ==========================================
const appName = process.argv[2]; 
const action = process.argv[3] || 'dev'; 
const platform = process.argv[4] || 'desktop'; 

if (!appName) {
  console.error("❌ Please provide an app name!");
  process.exit(1);
}

const manifestPath = path.resolve('hyper.apps.json');
if (!fs.existsSync(manifestPath)) {
  console.error(`❌ ERROR: hyper.apps.json not found!`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const config = manifest[appName];

if (!config) {
  console.error(`❌ ERROR: App '${appName}' not found in hyper.apps.json!`);
  process.exit(1);
}

const appVersion = config.version || "1.0.0";
console.log(`\n🚀 [OPTIMIZED BUILDER] Starting ${config.name} (v${appVersion}) for ${platform.toUpperCase()}...\n`);

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
    "security": { 
      "assetProtocol": { "enable": true, "scope": ["**/*"] },
      // 🔥 THE FIX: Allow Localhost Audio & Media Streaming on Android
      "csp": "default-src 'self' http://localhost:8765 asset: tauri: blob: data:; img-src 'self' http://localhost:8765 asset: tauri: blob: data:; media-src 'self' http://localhost:8765 asset: tauri: blob: data:; connect-src 'self' http://localhost:8765 tauri: wss://*;"
    }
  },
  // 🔥 THE ANDROID STREAMING FIX: Tauri ko bolo ki Android par HTTP cleartext traffic allow kare
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
  }
};
fs.writeFileSync(path.resolve(`src-tauri/tauri.${appName}.conf.json`), JSON.stringify(baseTauriConfig, null, 2));

const tauriCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

let androidSdkPath = process.env.ANDROID_HOME || '';
let androidNdkPath = process.env.NDK_HOME || '';

// ==========================================
// 🧠 PHASE 2: SMART ENVIRONMENT PREP
// ==========================================
if (platform === 'android') {
  if (!androidSdkPath) {
    androidSdkPath = process.platform === 'win32' 
      ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
      : path.join(process.env.HOME, 'Library', 'Android', 'sdk');
  }

  if (!androidNdkPath && fs.existsSync(path.join(androidSdkPath, 'ndk'))) {
    const ndkDir = path.join(androidSdkPath, 'ndk');
    let versions = fs.readdirSync(ndkDir).filter(f => fs.statSync(path.join(ndkDir, f)).isDirectory());
    
    if (process.platform === 'win32') {
       versions = versions.filter(v => !v.startsWith('29.')); 
    }

    if (versions.length > 0) {
      versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true })); 
      androidNdkPath = path.join(ndkDir, versions[0]);
      console.log(`🤖 Selected Stable NDK: ${versions[0]}`);
    } else {
      console.error(`\n❌ ERROR: No stable NDK found!`);
      process.exit(1);
    }
  }
}

const env = { 
  ...process.env, 
  HYPER_PORT: config.port.toString(),
  VITE_APP_TARGET: appName,
  VITE_SERVER_PORT: config.port.toString()
};

if (platform === 'android') {
  env.ANDROID_HOME = androidSdkPath;
  env.NDK_HOME = androidNdkPath;
  env.ANDROID_NDK_HOME = androidNdkPath; 

  const packagePath = config.identifier.split('.').join('/'); 
  const expectedDir = path.resolve(`src-tauri/gen/android/app/src/main/java/${packagePath}`);
  const genDir = path.resolve('src-tauri/gen/android');
  
  if (!fs.existsSync(expectedDir)) {
    console.log(`🔄 Initializing Android framework...`);
    if (fs.existsSync(genDir)) fs.rmSync(genDir, { recursive: true, force: true });
    execSync(`${tauriCmd} tauri android init --config src-tauri/tauri.${appName}.conf.json`, { stdio: 'ignore', env });
  }

  if (fs.existsSync(genDir)) {
    try {
      console.log(`🧹 Killing background Gradle Daemons to clear old cache...`);
      execSync(`gradlew.bat --stop`, { cwd: genDir, stdio: 'ignore' });
    } catch(e) {}
  }

  const localPropsPath = path.resolve('src-tauri/gen/android/local.properties');
  if (!fs.existsSync(localPropsPath)) {
    fs.writeFileSync(localPropsPath, `sdk.dir=${androidSdkPath.replace(/\\/g, '/')}\n`);
  }

  if (process.platform === 'win32') {
    const tempBin = path.resolve('scripts/.android_bin');
    if (!fs.existsSync(tempBin)) fs.mkdirSync(tempBin, { recursive: true });
    
    fs.writeFileSync(path.join(tempBin, 'npm.bat'), `@echo off\nnpm.cmd %*\n`);
    fs.writeFileSync(path.join(tempBin, 'npx.bat'), `@echo off\nnpx.cmd %*\n`);
    
    const systemPath = process.env.PATH || process.env.Path || ''; 
    env.PATH = `${tempBin};${systemPath}`;
    env.Path = env.PATH;
  }

  if (action === 'build') {
    const keystorePassword = process.env.KEYSTORE_PASSWORD;
    const absoluteKeystorePath = path.resolve('keys/hyper-release.keystore').replace(/\\/g, '/'); 
    
    if (keystorePassword && fs.existsSync(absoluteKeystorePath)) {
      const keystoreContent = `storePassword=${keystorePassword}\nkeyPassword=${keystorePassword}\nkeyAlias=hyper_alias\nstoreFile=${absoluteKeystorePath}`;
      fs.writeFileSync(path.resolve('src-tauri/gen/android/keystore.properties'), keystoreContent); 
      fs.writeFileSync(path.resolve('src-tauri/gen/android/app/keystore.properties'), keystoreContent); 
      console.log(`🔐 Production Keystore injected!`);
    } else {
       console.log(`⚠️ Warning: Keystore not found in 'keys/' folder or Password missing in .env!`);
    }
  }
}

// ==========================================
// ⚙️ PHASE 3: EXECUTION
// ==========================================
let tauriArgs = ['tauri'];
if (platform === 'android') tauriArgs.push('android');
tauriArgs.push(action, '--config', `src-tauri/tauri.${appName}.conf.json`, '--features', config.featureFlag);

// 🔥 FIX: Android APK generation force kiya gaya hai
if (platform === 'android' && action === 'build') {
  tauriArgs.push('--apk');
}

tauriArgs.push('--', '--no-default-features');

console.log(`\n⏳ Building via Tauri... This might take a few minutes.\n`);
const child = spawn(tauriCmd, tauriArgs, { env, stdio: 'inherit', shell: process.platform === 'win32' });

// ==========================================
// 📦 PHASE 4: ARTIFACT COLLECTION (NEW STRUCTURE)
// ==========================================
function findFiles(dir, ext, fileList = []) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) findFiles(filePath, ext, fileList);
      else if (filePath.endsWith(ext)) fileList.push(filePath);
    }
  }
  return fileList;
}

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Build Failed! Check the logs above.`);
    process.exit(code);
  }
  
  if (action === 'build') {
    console.log(`\n📦 Harvesting release artifacts...`);
    
    // 🔥 Naya OS-Level Folder Structure: build/windows ya build/android
    const targetOS = platform === 'desktop' ? 'windows' : 'android';
    const releaseDir = path.resolve(`build/${targetOS}/${config.name}/v${appVersion}`);
    
    if (!fs.existsSync(releaseDir)) fs.mkdirSync(releaseDir, { recursive: true });

    if (platform === 'desktop') {
      const tauriTarget = path.resolve('src-tauri/target/release');
      const rawExe = path.join(tauriTarget, `${config.name}.exe`);
      if (fs.existsSync(rawExe)) {
        const newName = `${config.name}-v${appVersion}-Portable.exe`;
        fs.copyFileSync(rawExe, path.join(releaseDir, newName));
        console.log(`   ✅ Copied: ${newName}`);
      }
    } 
    else if (platform === 'android') {
       findFiles(path.resolve('src-tauri/gen/android/app/build/outputs/apk'), '.apk').forEach(file => {
          const newName = `${config.name}-v${appVersion}-${path.basename(file)}`;
          fs.copyFileSync(file, path.join(releaseDir, newName));
          console.log(`   📱 Copied Signed APK: ${newName}`);
       });
       findFiles(path.resolve('src-tauri/gen/android/app/build/outputs/bundle'), '.aab').forEach(file => {
          const newName = `${config.name}-v${appVersion}-${path.basename(file)}`;
          fs.copyFileSync(file, path.join(releaseDir, newName));
          console.log(`   🛍️  Copied PlayStore AAB: ${newName}`);
       });
    }
    console.log(`\n🎉 Success! Files perfectly organized at: ${releaseDir}`);
  }
});