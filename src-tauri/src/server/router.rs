use axum::{routing::get, Router};
use tower_http::cors::CorsLayer;
use crate::server::state::AppState; // <-- 'core::' removed
use crate::server::media; // <-- 'core::' removed
use crate::services::hyperlink::{clipboard, links}; 

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/", get(|| async { "Hyper Server Node is Online! 🚀" }))
        .route("/api/ping", get(|| async { "pong" }))
        
        .route("/api/stream", get(media::stream_audio_handler))
        
        .route("/api/clipboard", get(clipboard::get_clipboard).post(clipboard::post_clipboard))
        .route("/api/clipboard/:id", axum::routing::delete(clipboard::delete_clipboard))
        .route("/api/links", get(links::get_links).post(links::add_link))
        
        .layer(CorsLayer::permissive())
        .with_state(state)
}