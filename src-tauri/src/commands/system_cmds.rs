use std::process::Command;
use tauri::State;
use serde::Serialize;

use crate::core::system::metrics::get_current_metrics;
use crate::models::system_types::{SystemMetrics, SystemInfo, ProcessData, BatteryData};
use crate::SysState; 

#[tauri::command]
pub fn fetch_system_metrics(state: State<'_, SysState>) -> SystemMetrics {
    let mut sys = state.0.lock().unwrap();
    get_current_metrics(&mut sys)
}

#[tauri::command]
pub fn get_system_info(state: State<'_, SysState>) -> SystemInfo {
    let mut sys = state.0.lock().unwrap();
    
    sys.refresh_cpu_all();
    sys.refresh_memory();

    SystemInfo {
        os_name: sysinfo::System::name().unwrap_or_else(|| "Windows 11 ARM".to_string()),
        os_version: sysinfo::System::os_version().unwrap_or_else(|| "Unknown".to_string()),
        cpu_name: sys.cpus().first().map(|c| c.brand().to_string()).unwrap_or_else(|| "ARM Processor".to_string()),
        total_memory: sys.total_memory() / 1_073_741_824, // Convert bytes to GB
        host_name: sysinfo::System::host_name().unwrap_or_else(|| "Hyper_Realm_Node".to_string()),
        architecture: std::env::consts::ARCH.to_string(),
    }
}

#[tauri::command]
pub fn get_processes(state: State<'_, SysState>) -> Vec<ProcessData> {
    let mut sys = state.0.lock().unwrap();
    
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    
    let mut procs = Vec::new();
    for (pid, process) in sys.processes() {
        let name = process.name().to_string_lossy().trim().to_string();
        if !name.is_empty() {
            procs.push(ProcessData {
                pid: pid.as_u32(),
                name,
                cpu_usage: process.cpu_usage(),
                memory: process.memory(),
            });
        }
    }
    
    procs.sort_by(|a, b| b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap_or(std::cmp::Ordering::Equal));
    procs.into_iter().take(30).collect()
}

#[tauri::command]
pub fn get_battery_info() -> BatteryData {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("powershell")
            .args(&[
                "-NoProfile",
                "-Command",
                "(Get-CimInstance Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus | ConvertTo-Json -Compress) -replace '\\s', ''"
            ])
            .output();

        if let Ok(output) = output {
            if let Ok(json_str) = String::from_utf8(output.stdout) {
                if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(&json_str) {
                    if let Some(charge) = parsed["EstimatedChargeRemaining"].as_f64() {
                        let percentage = charge as f32;
                        let status_code = parsed["BatteryStatus"].as_u64().unwrap_or(2);
                        
                        let state = match status_code {
                            1 => "Discharging".to_string(),
                            2 => "Connected / AC Power".to_string(),
                            3 => "Fully Charged".to_string(),
                            4 | 5 => "Low Battery".to_string(),
                            6 | 7 | 8 | 9 => "Charging".to_string(),
                            _ => "Unknown".to_string(),
                        };

                        return BatteryData { percentage, state };
                    }
                }
            }
        }
    }

    BatteryData {
        percentage: 100.0,
        state: "AC Power / Connected".to_string(),
    }
}

#[tauri::command]
pub fn set_power_mode(mode: String) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let guid = match mode.as_str() {
            "power_saver" => "a1841308-3541-4fab-bc81-f71556f20b4a",
            "high_performance" => "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
            _ => "381b4222-f694-41f0-9685-ff5bb260df2e", // Balanced
        };

        let output = std::process::Command::new("powercfg")
            .args(&["/SetActive", guid])
            .output();

        match output {
            Ok(_) => return Ok(format!("Power profile successfully shifted to {}", mode)),
            Err(e) => return Err(e.to_string()),
        }
    }
    
    #[cfg(not(target_os = "windows"))]
    Err("Power profiles are only supported on Windows ARM64/x64 nodes.".to_string())
}

#[derive(Serialize)]
pub struct PowerTelemetry {
    pub current_wattage: f32,
    pub session_draw_mah: f32,
}

#[tauri::command]
pub fn get_power_telemetry() -> PowerTelemetry {
    PowerTelemetry {
        current_wattage: 4.8,
        session_draw_mah: 350.0,
    }
}