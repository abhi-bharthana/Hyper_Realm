use axum::{
    extract::{State, Path},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;
use crate::server::state::{AppState, ClipboardEntry};// State import kiya

#[derive(Deserialize)]
pub struct ClipboardPayload {
    pub text: String,
}

pub async fn get_clipboard(State(state): State<AppState>) -> Json<Vec<ClipboardEntry>> {
    let data = state.clipboard.lock().unwrap().clone();
    Json(data)
}

pub async fn post_clipboard(
    State(state): State<AppState>, 
    Json(payload): Json<ClipboardPayload>
) -> impl IntoResponse {
    let mut data = state.clipboard.lock().unwrap();
    
    // Duplicate Check
    if let Some(latest) = data.first() {
        if latest.text == payload.text {
            return StatusCode::OK;
        }
    }

    let new_entry = ClipboardEntry {
        id: Uuid::new_v4().to_string(),
        text: payload.text,
        timestamp: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
    };

    data.insert(0, new_entry);

    if data.len() > 50 {
        data.truncate(50);
    }

    StatusCode::OK
}

// Delete Route Handler
pub async fn delete_clipboard(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let mut data = state.clipboard.lock().unwrap();
    data.retain(|entry| entry.id != id);
    StatusCode::OK
}