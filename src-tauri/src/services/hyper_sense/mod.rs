// 🧠 Nayi files ko public modules ke roop mein declare karna zaroori hai
pub mod engine;
pub mod commands;

use tantivy::schema::*;
use serde::{Serialize, Deserialize};

// Unified Data Structure jo frontend ko jayegi
#[derive(Serialize, Deserialize, Clone)]
pub struct HyperSenseResult {
    pub id: String,
    pub title: String,
    pub subtitle: String,
    pub source: String,
    pub payload: String, // Frontend actions ke liye JSON string
}

// Ye Trait kisi bhi app (Music, Recorder) ko pluggable banayega
pub trait HyperSensePlugin {
    fn name(&self) -> &'static str;
    fn get_index_data(&self) -> Vec<HyperSenseResult>; 
}

// Tantivy Schema Builder
pub fn build_schema() -> Schema {
    let mut schema_builder = Schema::builder();
    
    // TEXT for full-text search, STRING for exact match filtering
    schema_builder.add_text_field("id", STRING | STORED);
    schema_builder.add_text_field("title", TEXT | STORED);
    schema_builder.add_text_field("subtitle", TEXT | STORED);
    schema_builder.add_text_field("source", STRING | STORED);
    schema_builder.add_text_field("payload", STORED);
    
    schema_builder.build()
}