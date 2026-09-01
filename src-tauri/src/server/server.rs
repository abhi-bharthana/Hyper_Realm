use axum::{
    extract::Query,
    http::{header, StatusCode},
    response::IntoResponse,
    routing::get,
    Router,
};
use serde::Deserialize;
use std::fs::File;
use std::io::Read;
use tower_http::cors::CorsLayer;

#[derive(Deserialize)]
pub struct StreamQuery {
    path: String,
}

// 🌐 Server Start Function
pub async fn start_server(port: u16) {
    let app = Router::new()
        .route("/", get(|| async { "Hyper Dashboard Backend is Online! 🚀" })) // <-- Yeh naya root route add kiya
        .route("/api/ping", get(|| async { "Hyper Dashboard Server is Live! 🚀" }))
        .route("/api/stream", get(stream_audio_handler))
        .layer(CorsLayer::permissive());

    let addr = format!("127.0.0.1:{}", port);
    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(l) => l,
        Err(e) => {
            eprintln!("Failed to bind server port {}: {}", port, e);
            return;
        }
    };
    
    println!("🔥 Local Music Server running on http://{}", addr);
    
    if let Err(e) = axum::serve(listener, app).await {
        eprintln!("Server error: {}", e);
    }
}
// 🎧 Audio Streaming Handler (Fixed Axum 0.7 Query extractor syntax)
async fn stream_audio_handler(Query(params): Query<StreamQuery>) -> impl IntoResponse {
    let path = params.path;
    
    let mut file = match File::open(&path) {
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
        .header(header::CONTENT_TYPE, "audio/mpeg")
        .header(header::CONTENT_LENGTH, file_size)
        .body(axum::body::Body::from(buffer))
        .unwrap()
}