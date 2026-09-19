use tauri::{State, Window, Emitter};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use hound::{WavWriter, WavSpec, SampleFormat};
use std::time::Duration;

pub struct RecorderAppState {
    pub is_recording: Arc<AtomicBool>,
    pub is_paused: Arc<AtomicBool>,
}

impl Default for RecorderAppState {
    fn default() -> Self {
        Self {
            is_recording: Arc::new(AtomicBool::new(false)),
            is_paused: Arc::new(AtomicBool::new(false)),
        }
    }
}

#[tauri::command]
pub async fn start_recording(window: Window, state: State<'_, RecorderAppState>) -> Result<String, String> {
    if state.is_recording.load(Ordering::SeqCst) {
        return Err("Already recording!".to_string());
    }

    state.is_recording.store(true, Ordering::SeqCst);
    state.is_paused.store(false, Ordering::SeqCst);

    let is_rec = Arc::clone(&state.is_recording);
    let is_paused = Arc::clone(&state.is_paused);

    std::thread::spawn(move || {
        let host = cpal::default_host();
        let device = match host.default_input_device() {
            Some(d) => d,
            None => {
                eprintln!("No input device found");
                is_rec.store(false, Ordering::SeqCst);
                return;
            }
        };

        let config = match device.default_input_config() {
            Ok(c) => c,
            Err(e) => {
                eprintln!("Config error: {}", e);
                is_rec.store(false, Ordering::SeqCst);
                return;
            }
        };

        // 🔥 FIX: Ab file OS ke temporary folder mein save hogi, src-tauri mein nahi!
        let temp_dir = std::env::temp_dir();
        let file_path = temp_dir.join("hyper_realm_recording.wav").to_string_lossy().to_string();
        
        let spec = WavSpec {
            channels: config.channels(),
            sample_rate: config.sample_rate().0,
            bits_per_sample: 32,
            sample_format: SampleFormat::Float,
        };
        
        let writer = match WavWriter::create(&file_path, spec) {
            Ok(w) => Arc::new(Mutex::new(Some(w))),
            Err(e) => {
                eprintln!("Hound error: {}", e);
                is_rec.store(false, Ordering::SeqCst);
                return;
            }
        };

        let writer_clone = Arc::clone(&writer);
        let is_paused_clone = Arc::clone(&is_paused);
        let err_fn = |err| eprintln!("Audio stream error: {}", err);

        let stream = match config.sample_format() {
            cpal::SampleFormat::F32 => device.build_input_stream(
                &config.into(),
                move |data: &[f32], _: &_| {
                    if !is_paused_clone.load(Ordering::SeqCst) {
                        if let Ok(mut guard) = writer_clone.lock() {
                            if let Some(w) = guard.as_mut() {
                                for &sample in data {
                                    w.write_sample(sample).ok();
                                }
                            }
                        }

                        let sum_squares: f32 = data.iter().map(|&s| s * s).sum();
                        let rms = (sum_squares / data.len() as f32).sqrt();
                        let _ = window.emit("audio-level", rms);
                    }
                },
                err_fn,
                None,
            ),
            _ => {
                eprintln!("Unsupported mic format. Ensure your mic supports 32-bit float.");
                is_rec.store(false, Ordering::SeqCst);
                return;
            }
        };

        let stream = match stream {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Stream build error: {}", e);
                is_rec.store(false, Ordering::SeqCst);
                return;
            }
        };

        if let Err(e) = stream.play() {
            eprintln!("Stream play error: {}", e);
            is_rec.store(false, Ordering::SeqCst);
            return;
        }

        println!("🎙️ Recording Started...");

        while is_rec.load(Ordering::SeqCst) {
            std::thread::sleep(Duration::from_millis(50));
        }

        drop(stream); 
        
        if let Ok(mut guard) = writer.lock() {
            if let Some(w) = guard.take() {
                w.finalize().ok();
                println!("🛑 Recording Stopped & Saved at: {}", file_path);
            }
        };
    });

    Ok("Recording started".to_string())
}

#[tauri::command]
pub async fn pause_recording(state: State<'_, RecorderAppState>) -> Result<String, String> {
    state.is_paused.store(true, Ordering::SeqCst);
    println!("⏸️ Recording Paused...");
    Ok("Paused".to_string())
}

#[tauri::command]
pub async fn resume_recording(state: State<'_, RecorderAppState>) -> Result<String, String> {
    state.is_paused.store(false, Ordering::SeqCst);
    println!("▶️ Recording Resumed...");
    Ok("Resumed".to_string())
}

#[tauri::command]
pub async fn stop_recording(state: State<'_, RecorderAppState>) -> Result<String, String> {
    state.is_recording.store(false, Ordering::SeqCst);
    state.is_paused.store(false, Ordering::SeqCst);
    
    // 🔥 FIX: Return the correct temp file path to frontend
    let temp_dir = std::env::temp_dir();
    let file_path = temp_dir.join("hyper_realm_recording.wav").to_string_lossy().to_string();
    
    Ok(file_path)
}