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

#[tauri::command]
pub async fn request_audio_permissions() -> bool {
    #[cfg(target_os = "android")]
    {
        // Yahan Android ka actual permission logic aayega
        // Abhi ke liye isko true return karwate hain taaki app properly load ho jaye
        true
    }
    
    #[cfg(not(target_os = "android"))]
    {
        // Windows/Linux/MacOS par hamesha true
        true
    }
}