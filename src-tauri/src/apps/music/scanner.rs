use crate::apps::music::models::Track;
use id3::{Tag, TagLike};
use walkdir::WalkDir;
use rayon::prelude::*; // 🔥 God-level Concurrency
use std::thread;
use std::time::Duration;
use std::path::Path;
use tauri::{AppHandle, Emitter}; // 🔥 Added for live progress
use std::sync::atomic::{AtomicUsize, Ordering};

#[derive(Clone, Copy)]
pub enum IndexingSpeed {
    Fast,
    Balanced,
    Background,
}

impl From<&str> for IndexingSpeed {
    fn from(s: &str) -> Self {
        match s {
            "fast" => IndexingSpeed::Fast,
            "balanced" => IndexingSpeed::Balanced,
            "background" => IndexingSpeed::Background,
            _ => IndexingSpeed::Balanced,
        }
    }
}

// React ko live data bhejne ke liye structure
#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    processed: usize,
    total: usize,
    current_file: String,
}

fn parse_track(path: &Path) -> Track {
    let path_str = path.to_string_lossy().to_string();
    let mut title = path.file_stem().unwrap_or_default().to_string_lossy().to_string();
    let mut artist = "Unknown Artist".to_string();
    let mut album = "Unknown Album".to_string();

    let encoded_path = urlencoding::encode(&path_str);
    
    let cover_url = format!("http://127.0.0.1:8765/api/cover?path={}", encoded_path);
    let stream_url = format!("http://127.0.0.1:8765/api/stream?path={}", encoded_path);

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
}

// 🚀 Main Scanner Function (Ab `app` handle ke saath)
// 🚀 Main Scanner Function (Ab BULLETPROOF Path Cleaner ke saath)
pub fn scan_directory(app: AppHandle, dir_path: &str, speed_mode: &str) -> Vec<Track> {
    let mut target_paths = Vec::new();

    // 🔥 THE BULLETPROOF PATH CLEANER 🔥
    // Tauri dialog se aane wale saare kachre ko saaf karo
    let clean_path = dir_path
        .replace("file://", "")
        .replace("\"", "") // Frontend ke extra quotes hatao
        .replace("\\\\?\\", "") // Windows ke ajeeb API prefixes hatao
        .trim()
        .to_string();

    let decoded = urlencoding::decode(&clean_path).unwrap_or_default().to_string();

    if decoded.starts_with("content://") {
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
        target_paths.push(decoded);
    }

    let mut paths = Vec::new();
    
    // 1. FAST I/O PASS: Sab folders mein ghus ke gaane nikalo
    for t_path in &target_paths {
        let final_path = std::path::Path::new(t_path);
        
        // 🚨 DEBUGGING ALERT: Ye line terminal mein bataegi ki kya path check ho raha hai
        println!("🔍 FINAL CLEAN PATH TO SCAN: '{}'", final_path.display());
        println!("👉 Path exists on PC? : {}", final_path.exists());

        if !final_path.exists() {
            println!("⚠️ PATH GAYAB HAI! Rust ko ye folder mila hi nahi!");
            continue;
        }

        let mut found: Vec<_> = WalkDir::new(final_path)
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

    let total = paths.len();
    if total == 0 {
        println!("⚠️ 0 songs found! Please check the path printed above.");
        return vec![];
    }

    let speed = IndexingSpeed::from(speed_mode);
    let processed = AtomicUsize::new(0);

    // 🔥 HELPER: React ko live percentage bhejne ke liye
    let emit_progress = |track: &Track| {
        let count = processed.fetch_add(1, Ordering::Relaxed) + 1;
        if count % 3 == 0 || count == total {
            let _ = app.emit("indexing-progress", ProgressPayload {
                processed: count,
                total,
                current_file: track.title.clone(),
            });
        }
    };

    // 2. SMART PASS: Mode ke hisaab se CPU use karo aur LIVE emit karo
    let tracks: Vec<Track> = match speed {
        IndexingSpeed::Fast => {
            println!("🚀 Mode: FAST (100% CPU)");
            paths.into_par_iter().map(|path| {
                let track = parse_track(&path);
                emit_progress(&track);
                track
            }).collect()
        },
        IndexingSpeed::Balanced => {
            println!("⚖️ Mode: BALANCED (Parallel with micro-sleeps)");
            paths.into_par_iter().map(|path| {
                thread::sleep(Duration::from_millis(5)); 
                let track = parse_track(&path);
                emit_progress(&track);
                track
            }).collect()
        },
        IndexingSpeed::Background => {
            println!("🐢 Mode: BACKGROUND (Single Thread, UI will not freeze)");
            paths.into_iter().map(|path| {
                thread::sleep(Duration::from_millis(15));
                let track = parse_track(&path);
                emit_progress(&track);
                track
            }).collect()
        }
    };

    tracks
}