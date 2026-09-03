use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{mpsc, Arc, Mutex};
use tauri::{AppHandle, Emitter};
use crate::services::ai_runtime::vad::VadEngine;

pub struct AudioCapture {
    is_recording: Arc<AtomicBool>,
    stream: Option<cpal::Stream>,
    full_session_buffer: Arc<Mutex<Vec<f32>>>,
    pub sample_rate: u32, // 🚀 Naya field add kiya
}

impl AudioCapture {
    pub fn new() -> Self {
        Self {
            is_recording: Arc::new(AtomicBool::new(false)),
            stream: None,
            full_session_buffer: Arc::new(Mutex::new(Vec::new())),
            sample_rate: 44100, // Default fallback
        }
    }

    pub fn start(&mut self, app_handle: AppHandle) -> Result<(), String> {
        let host = cpal::default_host();
        let device = host.default_input_device().ok_or("No input device found")?;
        let config: cpal::StreamConfig = device.default_input_config().map_err(|e| e.to_string())?.into();
        
        // 🚀 Mic ka actual sample rate yahan store kar rahe hain
        self.sample_rate = config.sample_rate.0; 
        
        let sample_rate = config.sample_rate.0 as usize;
        let channels = config.channels as usize;
        let (tx, rx) = mpsc::channel::<Vec<f32>>();
        let recording_flag = self.is_recording.clone();
        let session_buffer_clone = self.full_session_buffer.clone();
        
        recording_flag.store(true, Ordering::SeqCst);

        std::thread::spawn(move || {
            let mut vad = VadEngine::new(sample_rate);
            while let Ok(audio_chunk) = rx.recv() {
                if !recording_flag.load(Ordering::Relaxed) { break; }
                
                let rms = (audio_chunk.iter().map(|&x| x * x).sum::<f32>() / audio_chunk.len() as f32).sqrt();
                let _ = app_handle.emit("audio-volume", rms);

                if let Some(speech_chunk) = vad.process_chunk(&audio_chunk) {
                    if let Some(stt_tx) = crate::services::ai_runtime::orchestrator::STT_TX.get() {
                        let _ = stt_tx.send(speech_chunk);
                    }
                }
            }
        });

        let stream = device.build_input_stream(
            &config,
            move |data: &[f32], _: &_| {
                let mono_data: Vec<f32> = if channels > 1 {
                    data.chunks_exact(channels).map(|f| f.iter().sum::<f32>() / channels as f32).collect()
                } else {
                    data.to_vec()
                };
                
                if let Ok(mut session_lock) = session_buffer_clone.lock() {
                    session_lock.extend_from_slice(&mono_data);
                }
                let _ = tx.send(mono_data);
            },
            |err| eprintln!("Mic error: {}", err),
            None,
        ).map_err(|e| e.to_string())?;

        stream.play().map_err(|e| e.to_string())?;
        self.stream = Some(stream);
        Ok(())
    }

    // 🚀 Return type mein sample_rate bhi bhej rahe hain
    pub fn stop(&mut self) -> (Vec<f32>, u32) {
        self.is_recording.store(false, Ordering::SeqCst);
        self.stream = None;
        let mut lock = self.full_session_buffer.lock().unwrap();
        (std::mem::take(&mut *lock), self.sample_rate)
    }
}

unsafe impl Send for AudioCapture {}
unsafe impl Sync for AudioCapture {}