use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct VideoMetadata {
    pub title: String,
    pub duration: f64,
    pub resolution: String,
    pub file_path: String,
}
