use std::sync::Mutex;
use tauri::State;

// Recorder App ki khud ki state
pub struct RecorderAppState {
    pub is_recording: Mutex<bool>,
}

impl Default for RecorderAppState {
    fn default() -> Self {
        Self {
            is_recording: Mutex::new(false),
        }
    }
}

#[tauri::command]
pub async fn start_recording(state: State<'_, RecorderAppState>) -> Result<String, String> {
    let mut is_rec = state.is_recording.lock().unwrap();
    
    if *is_rec {
        return Err("Already recording!".to_string());
    }
    
    *is_rec = true;
    println!("🎙️ Recorder App: Recording Started...");
    
    // Yahan humara cpal aur hound wala code aayega jo actual audio stream karega
    
    Ok("Recording started".to_string())
}

// state ke aage _ laga diya, isse warning chali jayegi!
#[tauri::command]
pub async fn pause_recording(_state: State<'_, RecorderAppState>) -> Result<String, String> {
    println!("⏸️ Recorder App: Recording Paused...");
    Ok("Paused".to_string())
}

#[tauri::command]
pub async fn stop_recording(state: State<'_, RecorderAppState>) -> Result<String, String> {
    let mut is_rec = state.is_recording.lock().unwrap();
    *is_rec = false;
    
    let file_path = "/users/music/recordings/audio_01.wav"; 
    println!("🛑 Recorder App: Recording Stopped & Saved at {}", file_path);
    
    Ok(file_path.to_string())
}