use crate::apps::manager::core::{get_running_apps, launch_application};
use crate::apps::manager::models::AppInfo;
use std::fs;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn launch_app_cmd(app_id: String) -> Result<AppInfo, String> {
    // Core function call karo
    launch_application(&app_id)
}

#[tauri::command]
pub fn fetch_running_apps() -> Vec<AppInfo> {
    get_running_apps()
}

// Naya optimized command profile picture save karne ke liye
#[tauri::command]
pub fn save_profile_picture(app: AppHandle, image_bytes: Vec<u8>) -> Result<String, String> {
    // OS ki native local data directory fetch karna (Memory efficient)
    // FIX: path_resolver() hata kar path() use kiya
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    // Ensure directory exists
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;

    // File path setup (tu chaho toh image format dynamic rakh sakta hai, par png safe hai)
    let file_path = app_dir.join("profile_pic.png");

    // Direct disk write taaki RAM free rahe
    fs::write(&file_path, image_bytes).map_err(|e| e.to_string())?;

    // Frontend ko path return kar rahe hain, heavy base64 string nahi
    Ok(file_path.to_string_lossy().into_owned())
}
