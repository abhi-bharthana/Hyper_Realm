sourceSets {
    commonMain.dependencies {
        implementation("io.ktor:ktor-client-core:2.3.11")
        implementation("io.ktor:ktor-client-websockets:2.3.11")
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
    }
}