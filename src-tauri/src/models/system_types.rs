use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub cpu_usage: f32,
    pub total_memory: u64,
    pub used_memory: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os_name: String,
    pub os_version: String,
    pub cpu_name: String,
    pub total_memory: u64,
    pub host_name: String,
    pub architecture: String,
}

// Naya: Processes ke liye struct
#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessData {
    pub pid: u32,
    pub name: String,
    pub cpu_usage: f32,
    pub memory: u64,
}

// Naya: Battery ke liye struct
#[derive(Debug, Serialize, Deserialize)]
pub struct BatteryData {
    pub percentage: f32,
    pub state: String,
}