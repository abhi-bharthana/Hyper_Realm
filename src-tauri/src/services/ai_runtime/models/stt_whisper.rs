use tauri::Manager;
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub async fn transcribe_audio(app: tauri::AppHandle, audio_path: String) -> Result<String, String> {
    // Tauri shell plugin ke through lightweight whisper executable chalana
    let output = app.shell().command("whisper-cli")
        .args([&audio_path, "--model", "tiny.en", "--output-format", "txt"])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        let text = String::from_utf8_lossy(&output.stdout).to_string();
        Ok(text)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}