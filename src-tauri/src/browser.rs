use tauri::{AppHandle, Emitter, WebviewUrl, WebviewWindowBuilder};
use url::Url;
use std::process::Command;
use std::path::PathBuf;

#[tauri::command]
pub fn open_browser_window(app: AppHandle, url: String) -> Result<String, String> {
    let parsed_url = if url.starts_with("http://") || url.starts_with("https://") {
        url.clone()
    } else {
        format!("https://{}", url)
    };

    let valid_url = Url::parse(&parsed_url).map_err(|e| format!("Invalid URL: {}", e))?;
    let window_label = format!("hyper_surf_{}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis());

    let builder = WebviewWindowBuilder::new(&app, window_label, WebviewUrl::External(valid_url))
        .title("Hyper-Surf")
        .inner_size(1280.0, 720.0)
        .resizable(true)
        .decorations(true)
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");

    match builder.build() {
        Ok(webview) => {
            #[cfg(debug_assertions)]
            let _ = webview.open_devtools();
            Ok("Browser window spawned successfully".to_string())
        },
        Err(e) => Err(format!("Failed to spawn browser: {}", e)),
    }
}

#[tauri::command]
pub fn download_file(app: AppHandle, url: String) -> Result<String, String> {
    // Windows user profile se direct Downloads folder nikalna (No extra crate needed)
    let profile = std::env::var("USERPROFILE").unwrap_or_else(|_| "C:\\".to_string());
    let download_dir = PathBuf::from(profile).join("Downloads");
    
    let raw_name = url.split('/').last().unwrap_or("downloaded_file.bin");
    let file_name = raw_name.split('?').next().unwrap_or(raw_name).to_string();
    let file_path = download_dir.join(&file_name);
    let output_path_str = file_path.to_string_lossy().to_string();

    let app_clone = app.clone();
    let f_name_clone = file_name.clone();
    
    std::thread::spawn(move || {
        let ps_command = format!(
            "Invoke-WebRequest -Uri '{}' -OutFile '{}'",
            url, output_path_str
        );

        let status = Command::new("powershell")
            .args(["-NoProfile", "-Command", &ps_command])
            .status();

        match status {
            Ok(s) if s.success() => {
                let _ = app_clone.emit("download-complete", &f_name_clone);
            },
            _ => {
                let _ = app_clone.emit("download-failed", &f_name_clone);
            }
        }
    });

    Ok(format!("Downloading {}...", file_name))
}