#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use sysinfo::System;

mod app_manager;
mod system;
mod browser;
mod video;

use app_manager::{launch_executable, set_process_mode};
use system::{get_processes, get_battery_info, get_system_info, SysState};
use browser::{open_browser_window, download_file};
use video::{scan_system_videos, prepare_video_playback}; // Transcoding function imported

fn main() {
    tauri::Builder::default()
        .manage(SysState(Mutex::new(System::new_all())))
        .invoke_handler(tauri::generate_handler![
            launch_executable,
            set_process_mode,
            get_processes,
            get_battery_info,
            get_system_info,
            open_browser_window,
            download_file,
            scan_system_videos,
            prepare_video_playback // Registered here
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}