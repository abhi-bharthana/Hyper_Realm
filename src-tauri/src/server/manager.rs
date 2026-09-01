use std::net::TcpListener;
use crate::server::state::AppState; // <-- Yahan se 'core::' hata diya

pub fn is_port_available(port: u16) -> bool {
    TcpListener::bind(format!("127.0.0.1:{}", port)).is_ok()
}

pub async fn start_axum_server(port: u16) {
    if !is_port_available(port) {
        println!("⚠️ Port {} is already in use. Server might be running in background.", port);
        return;
    }

    let state = AppState::new();
    // <-- Yahan se bhi 'core::' hata diya
    let app = crate::server::router::create_router(state); 
    let addr = format!("127.0.0.1:{}", port);
    
    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(l) => l,
        Err(e) => {
            eprintln!("❌ Failed to bind server port {}: {}", port, e);
            return;
        }
    };
    
    println!("🔥 Hyper Server Node active on http://{}", addr);
    
    if let Err(e) = axum::serve(listener, app).await {
        eprintln!("❌ Server crashed: {}", e);
    }
}