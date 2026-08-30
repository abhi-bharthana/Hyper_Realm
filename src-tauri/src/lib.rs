use std::sync::Mutex;
use sysinfo::System;

pub mod commands;
pub mod core;
pub mod models;
pub mod utils;

// Tumhara system state struct yahan aa gaya
pub struct SysState(pub Mutex<System>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Tumhara State yahan inject ho gaya
        .manage(SysState(Mutex::new(System::new_all())))
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            // 🖥️ System Commands
            commands::system_cmds::fetch_system_metrics,
            commands::system_cmds::get_system_info,
            commands::system_cmds::get_processes,   
            commands::system_cmds::get_battery_info,
            
            // 📦 App Manager Commands
            commands::app_cmds::launch_app_cmd,
            commands::app_cmds::fetch_running_apps,

            // 🎬 Video Commands
            commands::video_cmds::load_video,
            commands::video_cmds::play_video,

            // 🌐 Browser Commands
            commands::browser_cmds::open_url,
            commands::browser_cmds::format_search_query
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}