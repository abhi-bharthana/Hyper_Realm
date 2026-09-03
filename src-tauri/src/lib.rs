use std::sync::Mutex;
use sysinfo::System;

// 🚀 Naye Imports Recorder aur AudioCapture ke liye
use crate::services::ai_runtime::capture::AudioCapture;
use crate::services::ai_runtime::commands::RecorderState;

pub mod apps;     
pub mod server;   
pub mod services; 
pub mod utils;

pub struct SysState(pub Mutex<System>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::async_runtime::spawn(async {
        crate::server::manager::start_axum_server(8765).await;
    });

    tauri::Builder::default()
        // 🚀 Asli AudioCapture State ko inject kiya gaya hai yahan
        .manage(RecorderState(Mutex::new(AudioCapture::new())))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(SysState(Mutex::new(System::new_all())))
        .manage(services::cloud::cloud_cmd::CloudTunnelState {
            process: Mutex::new(None),
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            // 🚀 System Services
            services::system::commands::fetch_system_metrics,
            services::system::commands::get_system_info,
            services::system::commands::get_processes,
            services::system::commands::get_battery_info,
            
            // ☁️ Cloud Services
            services::cloud::cloud_cmd::start_cloud_tunnel,
            services::cloud::cloud_cmd::stop_cloud_tunnel,

            // 🖥️ App Services
            apps::manager::commands::launch_app_cmd,
            apps::manager::commands::fetch_running_apps,
            
            apps::video::commands::load_video,
            apps::video::commands::play_video,
            
            apps::browser::commands::open_url,
            apps::browser::commands::format_search_query,
            
            apps::music::commands::scan_music_directory,

            // 🎙️ AI Recorder & STT Commands
            services::ai_runtime::commands::start_recording,
            services::ai_runtime::commands::stop_recording,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}