use crate::apps::browser::engine::{create_new_tab, process_url};
use crate::apps::browser::models::BrowserTab;

#[tauri::command]
pub fn open_url(url: String) -> BrowserTab {
    create_new_tab(&url)
}

#[tauri::command]
pub fn format_search_query(query: String) -> String {
    process_url(&query)
}
