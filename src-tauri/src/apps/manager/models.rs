use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppInfo {
    pub id: String,
    pub name: String,
    pub status: String, // e.g., "running", "stopped"
}
