use crate::models::browser_types::BrowserTab;

pub fn process_url(raw_url: &str) -> String {
    // Agar search query hai toh google search mein convert karo, warna url return karo
    if raw_url.starts_with("http") {
        raw_url.to_string()
    } else {
        format!("https://www.google.com/search?q={}", raw_url.replace(" ", "+"))
    }
}

pub fn create_new_tab(url: &str) -> BrowserTab {
    BrowserTab {
        id: uuid::Uuid::new_v4().to_string(), // Ensure uuid crate is in Cargo.toml
        url: process_url(url),
        title: "New Tab".to_string(),
        is_active: true,
    }
}