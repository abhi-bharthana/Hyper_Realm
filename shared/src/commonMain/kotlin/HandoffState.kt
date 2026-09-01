import kotlinx.serialization.Serializable

@Serializable
data class HandoffState(
    val sourceDevice: String,   // E.g., "Abhi-Mobile" ya "Desktop-Core"
    val targetApp: String,      // E.g., "hyper-music", "hyper-surf"
    val actionContext: String,  // E.g., "resume_playback", "open_tab"
    val payloadData: String,    // E.g., "song_id_123" ya "https://github.com"
    val timestamp: Long
)