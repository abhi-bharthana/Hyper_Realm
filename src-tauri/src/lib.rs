use std::sync::Mutex;
use sysinfo::System;

// 🚀 Naye Imports Recorder aur AudioCapture ke liye
#[cfg(feature = "recorder-app")]
use crate::services::ai_runtime::capture::AudioCapture;
#[cfg(feature = "recorder-app")]
use crate::services::ai_runtime::commands::RecorderState;

pub mod apps;     
pub mod server;   
pub mod services; 
pub mod utils;

pub struct SysState(pub Mutex<System>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 🔥 SMART PORT LOGIC: Ab hardcoded if-else ki zaroorat nahi!
    // Node.js build script automatically 'HYPER_PORT' environment variable set karegi.
    let server_port: u16 = std::env::var("HYPER_PORT")
        .unwrap_or_else(|_| "8765".to_string())
        .parse()
        .unwrap_or(8765);

    tauri::async_runtime::spawn(async move {
        // Naya assigned port yahan use hoga
        crate::server::manager::start_axum_server(server_port).await;
    });

    // 1. Basic Builder Setup
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_os::init()) // 🔥 OS Detection Plugin Added Here!
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .manage(SysState(Mutex::new(System::new_all())))
        .manage(services::cloud::cloud_cmd::CloudTunnelState {
            process: Mutex::new(None),
        });

    // 2. 🚀 Asli AudioCapture State ko isolate kiya
    #[cfg(feature = "recorder-app")]
    {
        builder = builder.manage(RecorderState(Mutex::new(AudioCapture::new())));
    }

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
            
            // 🎬 Video Commands
            #[cfg(feature = "video-app")]
            apps::video::commands::load_video,
            #[cfg(feature = "video-app")]
            apps::video::commands::play_video,
            
            // 🌐 Browser Commands
            #[cfg(feature = "browser-app")]
            apps::browser::commands::open_url,
            #[cfg(feature = "browser-app")]
            apps::browser::commands::format_search_query,
            
            // 🎵 Music Commands
            #[cfg(feature = "music-app")]
            apps::music::commands::scan_music_directory,
            #[cfg(feature = "music-app")]
            apps::music::commands::request_audio_permissions, // 🔥 Naya Command Yahan Map Kiya Hai

            // 🎙️ AI Recorder & STT Commands
            #[cfg(feature = "recorder-app")]
            services::ai_runtime::commands::start_recording,
            #[cfg(feature = "recorder-app")]
            services::ai_runtime::commands::stop_recording,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}