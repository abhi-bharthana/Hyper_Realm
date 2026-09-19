use std::sync::Mutex;
use sysinfo::System;

// 🚀 Naye Imports Recorder App ke liye
#[cfg(feature = "recorder-app")]
use crate::apps::recorder::commands::RecorderAppState;

pub mod apps;     
pub mod server;   
pub mod services; 
pub mod utils;

pub struct SysState(pub Mutex<System>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let server_port: u16 = std::env::var("HYPER_PORT")
        .unwrap_or_else(|_| "8765".to_string())
        .parse()
        .unwrap_or(8765);

    tauri::async_runtime::spawn(async move {
        crate::server::manager::start_axum_server(server_port).await;
    });

    let hyper_sense_path = std::env::temp_dir().join("hyper_sense_index"); 
    let _ = std::fs::create_dir_all(&hyper_sense_path);
    
    let schema = crate::services::hyper_sense::build_schema();
    let hyper_sense_engine = crate::services::hyper_sense::engine::HyperSenseEngine::new(&hyper_sense_path, schema);

    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_os::init()) 
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .manage(SysState(Mutex::new(System::new_all())))
        .manage(services::cloud::cloud_cmd::CloudTunnelState {
            process: Mutex::new(None),
        })
        .manage(Mutex::new(hyper_sense_engine));

    // 2. 🎙️ Recorder State Inject karo
    #[cfg(feature = "recorder-app")]
    {
        builder = builder.manage(RecorderAppState::default());
    }

    // 3. Command Handler with Isolation
    builder
        .invoke_handler(tauri::generate_handler![
            services::system::commands::fetch_system_metrics,
            services::system::commands::get_system_info,
            services::system::commands::get_processes,
            services::system::commands::get_battery_info,
            
            services::cloud::cloud_cmd::start_cloud_tunnel,
            services::cloud::cloud_cmd::stop_cloud_tunnel,

            services::hyper_sense::commands::search_hypersense,

            apps::manager::commands::launch_app_cmd,
            apps::manager::commands::fetch_running_apps,
            
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
            apps::recorder::commands::resume_recording, // YAHAN ADD KIYA HAI
            #[cfg(feature = "recorder-app")]
            apps::recorder::commands::stop_recording,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}