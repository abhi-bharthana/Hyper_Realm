use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Track {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    #[serde(rename = "coverUrl")]
    pub cover_url: String,
    pub url: String,
    pub path: String,
}