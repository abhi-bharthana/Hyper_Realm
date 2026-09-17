use tauri::State;
use std::sync::Mutex;
use super::engine::HyperSenseEngine;
use super::HyperSenseResult;

// Frontend is command ko invoke karega
#[tauri::command]
pub async fn search_hypersense(
    query: String,
    engine: State<'_, Mutex<HyperSenseEngine>>,
) -> Result<Vec<HyperSenseResult>, String> {
    let engine_lock = engine.lock().map_err(|_| "Failed to lock engine".to_string())?;
    
    // Engine se search karwao
    let results = engine_lock.search(&query);
    
    Ok(results)
}