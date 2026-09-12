use axum::{
    extract::Query,
    http::{header, HeaderMap, StatusCode},
    response::IntoResponse,
};
use serde::Deserialize;
use std::fs::File;
use std::io::{Read, Seek, SeekFrom};
use std::path::PathBuf;

// --- 🎵 AUDIO STREAMING HANDLER (WITH BYTE-RANGE & CORS SUPPORT) ---

#[derive(Deserialize)]
pub struct StreamQuery {
    path: String,
}

pub async fn stream_audio_handler(
    headers: HeaderMap,
    Query(params): Query<StreamQuery>,
) -> impl IntoResponse {
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
    let mut start = 0;
    let mut end = file_size - 1;
    let mut is_partial = false;

    // 🔥 Range parse
    if let Some(range_header) = headers.get(header::RANGE) {
        if let Ok(range_str) = range_header.to_str() {
            let range_str = range_str.replace("bytes=", "");
            let parts: Vec<&str> = range_str.split('-').collect();

            if !parts.is_empty() && !parts[0].is_empty() {
                start = parts[0].parse::<u64>().unwrap_or(0);
            }
            if parts.len() > 1 && !parts[1].is_empty() {
                end = parts[1].parse::<u64>().unwrap_or(file_size - 1);
            }
            is_partial = true;
        }
    }

    if start > end || start >= file_size {
        return StatusCode::RANGE_NOT_SATISFIABLE.into_response();
    }

    let chunk_size = end - start + 1;
    let mut buffer = vec![0; chunk_size as usize];

    if file.seek(SeekFrom::Start(start)).is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    if file.read_exact(&mut buffer).is_err() {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }

    let mut response_headers = HeaderMap::new();
    
    // 🔥 CORS HEADERS (Crucial for Android WebView to accept cross-origin streams)
    response_headers.insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    response_headers.insert(header::ACCESS_CONTROL_ALLOW_HEADERS, "*".parse().unwrap());
    response_headers.insert(header::ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Range, Accept-Ranges, Content-Length".parse().unwrap());
    
    response_headers.insert(header::CONTENT_TYPE, "audio/mpeg".parse().unwrap());
    response_headers.insert(header::ACCEPT_RANGES, "bytes".parse().unwrap());
    response_headers.insert(header::CONTENT_LENGTH, chunk_size.to_string().parse().unwrap());

    if is_partial {
        let content_range = format!("bytes {}-{}/{}", start, end, file_size);
        response_headers.insert(header::CONTENT_RANGE, content_range.parse().unwrap());
        (StatusCode::PARTIAL_CONTENT, response_headers, buffer).into_response()
    } else {
        (StatusCode::OK, response_headers, buffer).into_response()
    }
}

// --- 🖼️ COVER ART HANDLER (WITH CORS) ---
#[derive(Deserialize)]
pub struct CoverQuery {
    path: String,
}

pub async fn serve_cover_art(Query(params): Query<CoverQuery>) -> impl IntoResponse {
    let decoded_path = match urlencoding::decode(&params.path) {
        Ok(p) => p.into_owned(),
        Err(_) => return (StatusCode::BAD_REQUEST, "Invalid path encoding").into_response(),
    };

    let file_path = PathBuf::from(&decoded_path);

    if let Ok(tag) = id3::Tag::read_from_path(&file_path) {
        if let Some(pic) = tag.pictures().next() {
            let mut response_headers = HeaderMap::new();
            response_headers.insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
            response_headers.insert(header::CONTENT_TYPE, pic.mime_type.parse().unwrap());
            
            return (StatusCode::OK, response_headers, pic.data.clone()).into_response();
        }
    }

    (StatusCode::NOT_FOUND, "No cover art found").into_response()
}