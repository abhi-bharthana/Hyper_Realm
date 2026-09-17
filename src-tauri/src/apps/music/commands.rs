use tauri::{State, AppHandle, Emitter}; // 🔥 FIX 1: Emitter aur AppHandle import kiya live progress ke liye
use std::sync::Mutex;
use crate::apps::music::scanner;
use crate::apps::music::models::Track;

// 🧠 Hyper Sense ke imports
use crate::services::hyper_sense::{HyperSenseResult, engine::HyperSenseEngine};

// 📡 React ko live data bhejne ke liye payload
#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    processed: usize,
    total: usize,
    current_file: String,
}

#[tauri::command]
// 🔥 FIX 2: Isko `async` banaya aur Naye parameters (app, speed) add kiye
pub async fn scan_music_directory(
    app: AppHandle,
    path: String,
    speed: String, 
    engine_state: State<'_, Mutex<HyperSenseEngine>>
) -> Result<Vec<Track>, String> { 
    println!("🔍 Scanning music in: {} (Speed: {})", path, speed);
    
    // UI ko batao ki folder dhundna shuru ho gaya hai
    let _ = app.emit("indexing-progress", ProgressPayload {
        processed: 0,
        total: 0,
        current_file: "Searching for files in folders...".to_string(),
    });
    
    // 🔥 FIX 3: Scanner ko app instance pass kiya (taaki wo gaane count karte waqt progress bhej sake)
    let tracks = scanner::scan_directory(app.clone(), &path, &speed);
    let total = tracks.len();
    
    // Agar gaane nahi mile toh frontend ko error bhejo
    if total == 0 {
        return Err(format!("0 tracks found in {}! Check your path.", path));
    }

    println!("🎵 Found {} tracks! Mapping for AI...", total);

    // AI Indexing ke waqt ki progress
    let _ = app.emit("indexing-progress", ProgressPayload {
        processed: total,
        total,
        current_file: "Building AI Vector Brain... (Heavy CPU)".to_string(),
    });

    // 🧠 1. HYPER SENSE PAYLOAD MAPPING
    let hypersense_docs: Vec<HyperSenseResult> = tracks.iter().map(|track| {
        let payload = serde_json::json!({
            "action": "play_music",
            "path": track.path,
            "id": track.id,
            "cover_url": track.cover_url,
            "stream_url": track.url
        }).to_string();

        HyperSenseResult {
            id: track.id.clone(),
            title: track.title.clone(),
            subtitle: format!("{} - {}", track.artist, track.album),
            source: "Music".to_string(),
            payload,
        }
    }).collect();

    // 🧠 2. HYPER SENSE BATCH INDEXING
    if let Ok(engine) = engine_state.lock() {
        if let Err(e) = engine.add_documents(hypersense_docs) {
            eprintln!("⚠️ Hyper Sense Indexing Error: {}", e);
            return Err(e.to_string());
        } else {
            println!("✅ Successfully indexed {} tracks into Hyper Sense!", total);
        }
    } else {
        return Err("Engine locked or busy".to_string());
    }

    Ok(tracks) // Frontend ko tracks return karo
}

#[tauri::command]
pub async fn request_audio_permissions() -> bool {
    #[cfg(target_os = "android")]
    {
        // Yahan Android ka actual permission logic aayega
        true
    }
    
    #[cfg(not(target_os = "android"))]
    {
        // Windows/Linux/MacOS par hamesha true
        true
    }
}