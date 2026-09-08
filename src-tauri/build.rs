fn main() {
    // 🔥 THE FIX: Android par C++ library link karna (Oboe/Audio crash rokne ke liye)
    if let Ok(os) = std::env::var("CARGO_CFG_TARGET_OS") {
        if os == "android" {
            println!("cargo:rustc-link-lib=c++_shared");
        }
    }

    tauri_build::build();
}