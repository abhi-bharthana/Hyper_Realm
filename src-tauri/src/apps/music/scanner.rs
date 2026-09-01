use crate::apps::music::models::Track;
use id3::{Tag, TagLike};
use walkdir::WalkDir;
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64_STANDARD};

pub fn scan_directory(dir_path: &str) -> Vec<Track> {
    let mut tracks = Vec::new();

    for entry in WalkDir::new(dir_path).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();
        
        if path.is_file() {
            if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
                if ext.eq_ignore_ascii_case("mp3") {
                    let path_str = path.to_string_lossy().to_string();
                    
                    let mut title = path.file_stem().unwrap_or_default().to_string_lossy().to_string();
                    let mut artist = "Unknown Artist".to_string();
                    let mut album = "Unknown Album".to_string();
                    let mut cover_url = String::new();

                    if let Ok(tag) = Tag::read_from_path(path) {
                        if let Some(t) = tag.title() { title = t.to_string(); }
                        if let Some(a) = tag.artist() { artist = a.to_string(); }
                        if let Some(al) = tag.album() { album = al.to_string(); }
                        
                        if let Some(pic) = tag.pictures().next() {
                            let mime_type = &pic.mime_type;
                            let base64_data = BASE64_STANDARD.encode(&pic.data);
                            cover_url = format!("data:{};base64,{}", mime_type, base64_data);
                        }
                    }

                    // 🚀 Naya Logic: URL Encoding ke sath direct stream link banana
                    let encoded_path = urlencoding::encode(&path_str);
                    let stream_url = format!("http://localhost:8765/api/stream?path={}", encoded_path);

                    tracks.push(Track {
                        id: path_str.clone(),
                        title,
                        artist,
                        album,
                        cover_url,
                        url: stream_url, // <--- Ab frontend seedha is link ko <audio> tag mein dalega
                        path: path_str,
                    });
                }
            }
        }
    }
    
    tracks
}