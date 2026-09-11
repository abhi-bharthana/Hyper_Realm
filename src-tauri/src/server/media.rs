use axum::{
    extract::Query,
    http::{header, StatusCode},
    response::IntoResponse,
};
use serde::Deserialize;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

// --- 🎵 AUDIO STREAMING HANDLER ---

#[derive(Deserialize)]
pub struct StreamQuery {
    path: String,
}

pub async fn stream_audio_handler(Query(params): Query<StreamQuery>) -> impl IntoResponse {
    // 1. Path decode karna zaroori hai (e.g., %20 ko wapas space mein badalna)
    let decoded_path = match urlencoding::decode(&params.path) {
        Ok(p) => p.into_owned(),
        Err(_) => return StatusCode::BAD_REQUEST.into_response(),
    };

    let mut file = match File::open(&decoded_path) {
        Ok(file) => file,
        Err(_) => return StatusCode::NOT_FOUND.into_response(),
    };

    let metadata = match file.metadata() {
        Ok(meta) => meta,
        Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    };

    let file_size = metadata.len();
    let mut buffer = Vec::new();
    
    if file.read_to_end(&mut buffer).is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }

    axum::response::Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "audio/mpeg") // Ise dynamic bhi kar sakte hain kal ko
        .header(header::CONTENT_LENGTH, file_size)
        .body(axum::body::Body::from(buffer))
        .unwrap()
}

// --- 🖼️ COVER ART HANDLER (GOD-LEVEL OPTIMIZATION) ---

#[derive(Deserialize)]
pub struct CoverQuery {
    path: String,
}

pub async fn serve_cover_art(Query(params): Query<CoverQuery>) -> impl IntoResponse {
    // 1. Path decode karo
    let decoded_path = match urlencoding::decode(&params.path) {
        Ok(p) => p.into_owned(),
        Err(_) => return (StatusCode::BAD_REQUEST, "Invalid path encoding").into_response(),
    };

    let file_path = PathBuf::from(&decoded_path);

    // 2. On-demand ID3 tag se image extract karo
    if let Ok(tag) = id3::Tag::read_from_path(&file_path) {
        if let Some(pic) = tag.pictures().next() {
            // 3. Raw image binary seedha bhej do (No Base64 RAM bloat!)
            return (
                [(header::CONTENT_TYPE, pic.mime_type.clone())],
                pic.data.clone(),
            ).into_response();
        }
    }

    // Agar cover art nahi hai, toh 404
    (StatusCode::NOT_FOUND, "No cover art found").into_response()
}