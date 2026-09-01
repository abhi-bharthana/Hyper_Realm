import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

@Composable
fun HyperLinkApp(handoffManager: HandoffManager) {
    // 🎧 Listen to the live global state
    val handoffState by handoffManager.incomingHandoff.collectAsState()
    
    // Auto-dismiss logic ke liye local state
    var showPopup by remember { mutableStateOf(false) }

    // Jaise hi naya handoff aayega, popup show hoga
    LaunchedEffect(handoffState) {
        if (handoffState != null) {
            showPopup = true
            delay(5000) // 5 seconds baad auto-hide
            showPopup = false
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF0A0A0C))) {
        // Yahan aapka main app content hoga (Hyper-Surf, Music, etc.)
        MainAppContent() 

        // 🚀 The Buttery Smooth Handoff Popup
        AnimatedVisibility(
            visible = showPopup,
            enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(tween(300)),
            exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(tween(300)),
            modifier = Modifier.align(Alignment.TopCenter).padding(top = 24.dp)
        ) {
            handoffState?.let { state ->
                Card(
                    modifier = Modifier.width(360.dp).padding(horizontal = 16.dp),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E22)),
                    elevation = CardDefaults.cardElevation(defaultElevation = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "📱 ${state.sourceDevice}",
                                color = Color(0xFF10B981), // Emerald Green
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Resume ${state.targetApp}?",
                                color = Color.White,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        Button(
                            onClick = { 
                                showPopup = false
                                // 🔗 Yahan hum Deep Link ya Navigation trigger karenge
                                // handleDeepLink(state.targetApp, state.payloadData)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6)),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Open", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MainAppContent() {
    // Placeholder for your actual UI
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Hyper-Link Core Environment", color = Color.White)
    }
}