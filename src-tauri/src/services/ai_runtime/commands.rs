use std::sync::Mutex;
use tauri::{AppHandle, State};
use super::capture::AudioCapture;
use super::storage::save_recording_package;

pub struct RecorderState(pub Mutex<AudioCapture>);

#[tauri::command]
pub fn start_recording(app: AppHandle, state: State<'_, RecorderState>) -> Result<String, String> {
    // 🚀 FIX: Added .inner() before .0.lock()
    let mut recorder = state.inner().0.lock().map_err(|_| "State locked")?;
    recorder.start(app)?;
    Ok("Recording Started".into())
}

#[tauri::command]
pub fn stop_recording(
    state: State<'_, RecorderState>,
    transcripts: Vec<serde_json::Value>, 
) -> Result<String, String> {
    // 🚀 FIX: Added .inner() before .0.lock()
    let mut recorder = state.inner().0.lock().map_err(|_| "State locked")?;
    
    // 🚀 Tuple unpack karke actual sample rate nikal liya
    let (full_audio, hw_sample_rate) = recorder.stop();
    
    let string_transcripts: Vec<String> = transcripts
        .into_iter()
        .map(|val| val.get("text").and_then(|t| t.as_str()).unwrap_or("").to_string())
        .collect();
    
    // 🚀 16000 ki jagah asli hardware speed paas kar di
    let saved_path = save_recording_package(&full_audio, hw_sample_rate, string_transcripts)?;
    
    Ok(format!("Saved successfully at: {}", saved_path))
}