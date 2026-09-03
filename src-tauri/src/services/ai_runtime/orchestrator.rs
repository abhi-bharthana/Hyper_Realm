use crossbeam_channel::{unbounded, Sender};
use std::sync::OnceLock;
use tauri::{AppHandle, Emitter};

pub static STT_TX: OnceLock<Sender<Vec<f32>>> = OnceLock::new();

pub fn init_ai_bus(app_handle: AppHandle) {
    let (tx, rx) = unbounded::<Vec<f32>>();
    STT_TX.set(tx).unwrap();

    std::thread::spawn(move || {
        println!("🚀 AI Bus: Initialized and waiting for VAD chunks...");
        
        while let Ok(audio_chunk) = rx.recv() {
            // MOCK STT: Sends a direct event to React when audio is detected
            let mock_text = format!(" [Processed {} audio samples perfectly] ", audio_chunk.len());
            let _ = app_handle.emit("transcript-update", mock_text);
        }
    });
}