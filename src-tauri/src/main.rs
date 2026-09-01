#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Ye tumhare lib.rs wale run() function ko call karega
    tauri_app_lib::run();
}
