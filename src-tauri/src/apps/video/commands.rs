use crate::apps::video::player::load_video_data;
use crate::apps::video::models::VideoMetadata;

#[tauri::command]
pub fn load_video(path: String) -> Result<VideoMetadata, String> {
    load_video_data(&path)
}

#[tauri::command]
pub fn play_video() -> String {
    // Play command wrapper
    "Video is playing".to_string()
}
