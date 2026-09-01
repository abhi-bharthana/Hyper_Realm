use axum::{
    extract::Query,
    http::{header, StatusCode},
    response::IntoResponse,
};
use serde::Deserialize;
use std::fs::File;
use std::io::Read;

#[derive(Deserialize)]
pub struct StreamQuery {
    path: String,
}

pub async fn stream_audio_handler(Query(params): Query<StreamQuery>) -> impl IntoResponse {
    let mut file = match File::open(&params.path) {
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