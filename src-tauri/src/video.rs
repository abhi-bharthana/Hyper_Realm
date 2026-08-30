use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use tauri::Manager;

#[derive(Serialize)]
pub struct VideoItem {
    pub name: String,
    pub path: String,
}

#[tauri::command]
pub fn scan_system_videos() -> Result<Vec<VideoItem>, String> {
    let profile = std::env::var("USERPROFILE").unwrap_or_else(|_| "C:\\".to_string());
    let video_dir = PathBuf::from(profile).join("Videos");
    
    let mut videos = Vec::new();
    
    if video_dir.exists() {
        if let Ok(entries) = fs::read_dir(video_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_file() {
                    if let Some(ext) = path.extension() {
                        let ext_str = ext.to_string_lossy().to_lowercase();
                        if ["mp4", "mkv", "webm", "avi", "mov", "flv", "wmv", "ts"].contains(&ext_str.as_str()) {
                            if let Some(name) = path.file_name() {
                                videos.push(VideoItem {
                                    name: name.to_string_lossy().into_owned(),
                                    path: path.to_string_lossy().into_owned(),
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    
    Ok(videos)
}

#[tauri::command]
pub fn prepare_video_playback(app: tauri::AppHandle, file_path: String) -> Result<String, String> {
    let path = PathBuf::from(&file_path);
    let ext = path.extension().unwrap_or_default().to_string_lossy().to_lowercase();

    if ext == "mp4" || ext == "webm" {
        return Ok(file_path);
    }

    // Corrected Error Handling Syntax (.map_err(...)? without stray characters)
    let cache_dir = app.path().app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("media_cache");
    
    let _ = fs::create_dir_all(&cache_dir);
    
    let file_stem = path.file_stem().unwrap_or_default().to_string_lossy();
    let output_path = cache_dir.join(format!("{}.mp4", file_stem));
    let output_str = output_path.to_string_lossy().to_string();

    if output_path.exists() {
        return Ok(output_str);
    }

    // FFmpeg pipeline with -pix_fmt yuv420p for WebView2 8-bit compatibility
    let status = Command::new("ffmpeg")
        .args([
            "-i", &file_path,
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "ultrafast",
            "-c:a", "aac",
            "-b:a", "128k",
            &output_str,
        ])
        .status();

    match status {
        Ok(s) if s.success() => Ok(output_str),
        _ => Err("FFmpeg transcoding failed.".to_string()),
    }
}