use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};

// Naya structure history store karne ke liye
#[derive(Clone, Serialize, Deserialize)]
pub struct ClipboardEntry {
    pub id: String,
    pub text: String,
    pub timestamp: u64,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct LinkItem {
    pub id: String,
    pub title: String,
    pub url: String,
}

#[derive(Clone)]
pub struct AppState {
    pub clipboard: Arc<Mutex<Vec<ClipboardEntry>>>, // <-- Ab yeh array ban gaya hai
    pub links: Arc<Mutex<Vec<LinkItem>>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            clipboard: Arc::new(Mutex::new(vec![])), // Blank history se start
            links: Arc::new(Mutex::new(vec![
                LinkItem {
                    id: "1".into(),
                    title: "Hyper Realm Cloud".into(),
                    url: "https://dashboard.hyper-realm.com".into(),
                }
            ])),
        }
    }
}