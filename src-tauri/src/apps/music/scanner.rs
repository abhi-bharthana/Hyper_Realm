use crate::apps::music::models::Track;
use id3::{Tag, TagLike};
use walkdir::WalkDir;
use rayon::prelude::*; // 🔥 God-level Concurrency

pub fn scan_directory(dir_path: &str) -> Vec<Track> {
    let mut target_paths = Vec::new();

    let clean_path = dir_path.replace("file://", "");
    let decoded = urlencoding::decode(&clean_path).unwrap_or_default().to_string();

    if decoded.starts_with("content://") {
        println!("📱 Content URI detected. Auto-scanning standard Android directories...");
        // Android URIs virtual hote hain. Hum seedha main folders pe attack karenge!
        target_paths.push("/storage/emulated/0/Music".to_string());
        target_paths.push("/storage/emulated/0/Download".to_string());
        target_paths.push("/storage/emulated/0/Documents".to_string());
        
        if decoded.contains("primary:") {
            let parts: Vec<&str> = decoded.split("primary:").collect();
            if parts.len() > 1 {
                let custom_path = format!("/storage/emulated/0/{}", parts[1]);
                if !target_paths.contains(&custom_path) {
                    target_paths.push(custom_path);
                }
            }
        }
    } else {
        target_paths.push(decoded); // For Windows/Desktop
    }

    let mut paths = Vec::new();
    
    // 1. FAST I/O PASS: Sab folders mein ghus ke gaane nikalo
    for t_path in &target_paths {
        println!("🔍 Scanning real path: {}", t_path);
        let mut found: Vec<_> = WalkDir::new(t_path)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.path().is_file())
            .filter_map(|e| {
                let path = e.path();
                let ext = path.extension()?.to_str()?;
                if matches!(ext.to_ascii_lowercase().as_str(), "mp3" | "flac" | "wav" | "m4a") {
                    Some(path.to_path_buf())
                } else {
                    None
                }
            })
            .collect();
        paths.append(&mut found);
    }

    // 2. CPU HEAVY PASS: ID3 tags parallel mein parse karo
    let tracks: Vec<Track> = paths.into_par_iter().map(|path| {
        let path_str = path.to_string_lossy().to_string();
        let mut title = path.file_stem().unwrap_or_default().to_string_lossy().to_string();
        let mut artist = "Unknown Artist".to_string();
        let mut album = "Unknown Album".to_string();

        let encoded_path = urlencoding::encode(&path_str);
        
        let cover_url = format!("http://localhost:8765/api/cover?path={}", encoded_path);
        let stream_url = format!("http://localhost:8765/api/stream?path={}", encoded_path);

        if let Ok(tag) = Tag::read_from_path(&path) {
            if let Some(t) = tag.title() { title = t.to_string(); }
            if let Some(a) = tag.artist() { artist = a.to_string(); }
            if let Some(al) = tag.album() { album = al.to_string(); }
        }

        Track {
            id: path_str.clone(),
            title,
            artist,
            album,
            cover_url,
            url: stream_url, 
            path: path_str,
        }
    }).collect();

    tracks
}