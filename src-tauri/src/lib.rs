use std::sync::Mutex;
use sysinfo::System;

// 🚀 Naye Imports Recorder App ke liye (AI aur Whisper ab permanently hata diya hai)
#[cfg(feature = "recorder-app")]
use crate::apps::recorder::commands::RecorderAppState;

pub mod apps;     
pub mod server;   
pub mod services; 
pub mod utils;

pub struct SysState(pub Mutex<System>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 🔥 SMART PORT LOGIC: Ab hardcoded if-else ki zaroorat nahi!
    let server_port: u16 = std::env::var("HYPER_PORT")
        .unwrap_or_else(|_| "8765".to_string())
        .parse()
        .unwrap_or(8765);

    tauri::async_runtime::spawn(async move {
        crate::server::manager::start_axum_server(server_port).await;
    });

    // 1. Basic Builder Setup
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_os::init()) 
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .manage(SysState(Mutex::new(System::new_all())))
        .manage(services::cloud::cloud_cmd::CloudTunnelState {
            process: Mutex::new(None),
        });

    // 2. 🎙️ Naya Recorder State Inject karo (No AI, pure native audio recorder)
    #[cfg(feature = "recorder-app")]
    {
        builder = builder.manage(RecorderAppState::default());
    }

    // 🚀 DHYAN DE: Yahan se 'NativeAudioPlayer' wala code hamesha ke liye delete kar diya hai.
    // Ab tera Rust backend kabhi audio hardware panic nahi karega!

    // 3. Command Handler with Isolation
    builder
        .invoke_handler(tauri::generate_handler![
            // System Services (Core)
            services::system::commands::fetch_system_metrics,
            services::system::commands::get_system_info,
            services::system::commands::get_processes,
            services::system::commands::get_battery_info,
            
            // Cloud Services (Core)
            services::cloud::cloud_cmd::start_cloud_tunnel,
            services::cloud::cloud_cmd::stop_cloud_tunnel,

            // App Services (Core)
            apps::manager::commands::launch_app_cmd,
            apps::manager::commands::fetch_running_apps,
            
            // 🎵 Music Commands (Sirf Scanner aur Permissions, No Native Player!)
            #[cfg(feature = "music-app")]
            apps::music::commands::scan_music_directory,
            #[cfg(feature = "music-app")]
            apps::music::commands::request_audio_permissions,

            // 🎙️ Clean Recorder Commands (Naya AI-Free Setup)
            #[cfg(feature = "recorder-app")]
            apps::recorder::commands::start_recording,
            #[cfg(feature = "recorder-app")]
            apps::recorder::commands::pause_recording,
            #[cfg(feature = "recorder-app")]
            apps::recorder::commands::stop_recording,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}