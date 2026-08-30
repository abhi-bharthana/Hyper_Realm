use std::process::Command;
use std::thread;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn launch_executable(app_handle: AppHandle, id: String, path: String) -> Result<String, String> {
    match Command::new("cmd").args(["/C", "start", "/WAIT", "", &path]).spawn() {
        Ok(mut child) => {
            let pid = child.id();
            
            thread::spawn(move || {
                let _ = child.wait();
                let _ = app_handle.emit("process-exited", id);
            });

            Ok(format!("Success! PID: {}", pid))
        },
        Err(e) => Err(format!("Launch failed: {}", e)),
    }
}

#[tauri::command]
pub fn set_process_mode(pid: u32, mode: String) -> Result<String, String> {
    let priority_class = match mode.as_str() {
        "efficient" => "Idle",
        "performance" => "High",
        _ => "Normal", // balanced
    };

    let cmd = format!("(Get-Process -Id {}).PriorityClass = '{}'", pid, priority_class);
    
    match Command::new("powershell")
        .args(["-NoProfile", "-Command", &cmd])
        .output() {
        Ok(_) => Ok(format!("PID {} set to {} mode", pid, mode)),
        Err(e) => Err(format!("Failed to set mode: {}", e)),
    }
}