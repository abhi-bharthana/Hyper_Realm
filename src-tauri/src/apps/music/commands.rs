use crate::apps::music::scanner;
use crate::apps::music::models::Track;

#[tauri::command]
pub fn scan_music_directory(path: String) -> Vec<Track> {
    // Ab seedha React ka bheja hua Android path yahan aayega
    println!("🔍 Scanning music in: {}", path);
    
    let tracks = scanner::scan_directory(&path);
    
    println!("🎵 Found {} tracks!", tracks.len());
    tracks
}