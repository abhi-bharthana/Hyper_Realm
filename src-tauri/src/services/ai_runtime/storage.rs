use hound::{WavSpec, WavWriter, SampleFormat};
use serde::Serialize;
use std::fs;
use chrono::Local;

#[derive(Serialize)]
pub struct TranscriptSegment {
    pub text: String,
}

#[derive(Serialize)]
pub struct SessionMetadata {
    pub date: String,
    pub segments: Vec<TranscriptSegment>,
}

pub fn save_recording_package(
    audio_data: &[f32],
    sample_rate: u32,
    transcripts: Vec<String>,
) -> Result<String, String> {
    // Cross-platform home directory fetch
    let home = std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .map_err(|_| "Could not find home directory")?;

    let timestamp = Local::now().format("%Y_%m_%d_%H%M%S").to_string();
    let folder_name = format!("Recording_{}", timestamp);
    
    let save_path = std::path::Path::new(&home).join(".hyper_realm").join("recordings").join(&folder_name);
    fs::create_dir_all(&save_path).map_err(|e| e.to_string())?;

    // Audio file save logic
    let audio_path = save_path.join("audio.wav");
    let spec = WavSpec {
        channels: 1,
        sample_rate,
        bits_per_sample: 32,
        sample_format: SampleFormat::Float,
    };

    let mut writer = WavWriter::create(&audio_path, spec).map_err(|e| e.to_string())?;
    for &sample in audio_data {
        writer.write_sample(sample).map_err(|e| e.to_string())?;
    }
    writer.finalize().map_err(|e| e.to_string())?;

    // Transcript save logic
    let segments: Vec<TranscriptSegment> = transcripts
        .into_iter()
        .map(|text| TranscriptSegment { text })
        .collect();

    let metadata = SessionMetadata {
        date: timestamp,
        segments,
    };

    let json_path = save_path.join("transcript.json");
    let json_file = fs::File::create(json_path).map_err(|e| e.to_string())?;
    serde_json::to_writer_pretty(json_file, &metadata).map_err(|e| e.to_string())?;

    Ok(save_path.to_string_lossy().into_owned())
}