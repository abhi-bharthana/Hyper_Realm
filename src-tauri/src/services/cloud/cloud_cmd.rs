use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_shell::{ShellExt, process::CommandEvent};
use std::sync::Mutex;
use tauri_plugin_shell::process::CommandChild;

pub struct CloudTunnelState {
    pub process: Mutex<Option<CommandChild>>,
}

#[tauri::command]
pub async fn start_cloud_tunnel(app: AppHandle) -> Result<String, String> {
    let state = app.state::<CloudTunnelState>();
    
    if state.process.lock().unwrap().is_some() {
        return Err("Tunnel is already running!".to_string());
    }

    // 🚀 App ke andar se directly Named Tunnel config ke sath spawn hoga
    let command = app.shell().command("cloudflared")
        .args(["tunnel", "--config", r"C:\Users\Abhi\.cloudflared\config.yml", "run", "hyper-cloud"]);

    let (mut rx, child) = command.spawn().map_err(|e| e.to_string())?;
    
    *state.process.lock().unwrap() = Some(child);

    let app_clone = app.clone();
    tauri::async_runtime::spawn(async move {
        let mut connected = false;
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stderr(line) | CommandEvent::Stdout(line) => {
                    let text = String::from_utf8_lossy(&line);
                    // Jaise hi cloudflared confirm karega ki connections register ho gaye hain
                    if text.contains("Registered tunnel connection") && !connected {
                        connected = true;
                        let _ = app_clone.emit("tunnel-ready", "https://dashboard.hyper-realm.com".to_string());
                    }
                }
                CommandEvent::Error(err) => {
                    let _ = app_clone.emit("tunnel-error", err);
                }
                CommandEvent::Terminated(payload) => {
                    let _ = app_clone.emit("tunnel-stopped", payload.code);
                    connected = false;
                }
                _ => {}
            }
        }
    });

    Ok("Tunnel starting...".to_string())
}

#[tauri::command]
pub fn stop_cloud_tunnel(app: AppHandle) -> Result<String, String> {
    let state = app.state::<CloudTunnelState>();
    let mut process_guard = state.process.lock().unwrap();
    
    if let Some(child) = process_guard.take() {
        let _ = child.kill();
        let _ = app.emit("tunnel-stopped", 0);
        Ok("Tunnel stopped successfully".to_string())
    } else {
        Err("No tunnel is running".to_string())
    }
}