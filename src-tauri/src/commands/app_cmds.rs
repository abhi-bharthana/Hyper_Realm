use crate::core::app_manager::manager::{launch_application, get_running_apps};
use crate::models::app_types::AppInfo;

#[tauri::command]
pub fn launch_app_cmd(app_id: String) -> Result<AppInfo, String> {
    // Core function call karo
    launch_application(&app_id)
}

#[tauri::command]
pub fn fetch_running_apps() -> Vec<AppInfo> {
    get_running_apps()
}