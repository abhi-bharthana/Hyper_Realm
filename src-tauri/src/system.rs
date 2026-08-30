use std::process::Command;
use std::sync::Mutex;
use std::sync::OnceLock;
use tauri::State;
use sysinfo::System;
use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
pub struct ProcessData {
    pub pid: u32,
    pub name: String,
    pub cpu: f32,
    pub ram: u64,
}

#[derive(Serialize)]
pub struct BatteryStatus {
    pub level: u8,
    pub charging: bool,
    pub exists: bool,
}

#[derive(Serialize)]
pub struct SystemInfo {
    pub os_name: String,
    pub os_version: String,
    pub cpu_name: String,
    pub total_memory: u64,
    pub host_name: String,
    pub architecture: String,
}

pub struct SysState(pub Mutex<System>);

// PowerShell command ko sirf ek baar run karke cache karne ke liye
static CPU_NAME_CACHE: OnceLock<String> = OnceLock::new();

#[tauri::command]
pub fn get_processes(state: State<SysState>) -> Vec<ProcessData> {
    let mut sys = state.0.lock().unwrap();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    
    let mut process_list: Vec<ProcessData> = sys.processes().iter().map(|(pid, proc)| {
        ProcessData {
            pid: pid.as_u32(),
            name: proc.name().to_string_lossy().to_string(),
            cpu: proc.cpu_usage(),
            ram: proc.memory() / 1024 / 1024,
        }
    }).collect();

    process_list.sort_by(|a, b| b.ram.cmp(&a.ram));
    process_list.into_iter().take(50).collect()
}

#[tauri::command]
pub fn get_battery_info() -> BatteryStatus {
    let output = Command::new("powershell")
        .args([
            "-NoProfile",
            "-Command",
            "Get-CimInstance -ClassName Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus | ConvertTo-Json"
        ])
        .output();

    if let Ok(out) = output {
        let json_str = String::from_utf8_lossy(&out.stdout);
        if let Ok(val) = serde_json::from_str::<Value>(&json_str) {
            let obj = if val.is_array() { &val[0] } else { &val };
            
            let level = obj["EstimatedChargeRemaining"].as_u64().unwrap_or(100) as u8;
            let status = obj["BatteryStatus"].as_u64().unwrap_or(1);
            let charging = status == 2; 

            return BatteryStatus { level, charging, exists: true };
        }
    }
    
    BatteryStatus { level: 100, charging: true, exists: false }
}

#[tauri::command]
pub fn get_system_info(state: State<SysState>) -> SystemInfo {
    let mut sys = state.0.lock().unwrap();
    sys.refresh_all(); 

    // Cached CPU Name (Zero latency on subsequent calls)
    let cpu_name = CPU_NAME_CACHE.get_or_init(|| {
        match Command::new("powershell")
            .args(["-NoProfile", "-Command", "(Get-CimInstance Win32_Processor | Select-Object -First 1).Name"])
            .output() {
                Ok(out) => {
                    let name = String::from_utf8_lossy(&out.stdout).trim().to_string();
                    if name.is_empty() {
                        sys.cpus().first().map(|cpu| cpu.brand().to_string()).unwrap_or_else(|| "Unknown ARM64 CPU".to_string())
                    } else {
                        name
                    }
                },
                Err(_) => "Unknown CPU".to_string(),
            }
    }).clone();

    SystemInfo {
        os_name: sysinfo::System::long_os_version().unwrap_or_else(|| "Windows".to_string()),
        os_version: sysinfo::System::kernel_version().unwrap_or_else(|| "Unknown".to_string()),
        cpu_name,
        total_memory: sys.total_memory() / 1024 / 1024 / 1024,
        host_name: sysinfo::System::host_name().unwrap_or_else(|| "Hyper_Node".to_string()),
        architecture: std::env::consts::ARCH.to_string(),
    }
}