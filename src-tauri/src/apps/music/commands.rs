use crate::apps::music::scanner;
use crate::apps::music::models::Track;

#[tauri::command]
pub fn scan_music_directory(dir_path: Option<String>) -> Vec<Track> {
    // Agar frontend se path nahi aaya, toh default C:\Users\Abhi\Music use karega
    let path = dir_path.unwrap_or_else(|| "C:\\Users\\Abhi\\Music".to_string());

    println!("🔍 Scanning music in: {}", path);
    
    let tracks = scanner::scan_directory(&path);
    
    println!("🎵 Found {} tracks!", tracks.len());
    tracks
}