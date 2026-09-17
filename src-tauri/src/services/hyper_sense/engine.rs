use tantivy::{Index, IndexReader, TantivyDocument, collector::TopDocs, query::QueryParser};
use tantivy::schema::*;
use std::path::Path;
use std::collections::HashMap;
use super::HyperSenseResult;

use candle_core::{Device, Tensor};
use candle_nn::VarBuilder;
use candle_transformers::models::bert::{BertModel, Config, DTYPE};
use tokenizers::Tokenizer;

pub struct HyperSenseEngine {
    index: Index,
    reader: IndexReader,
    ai_model: Option<BertModel>,
    tokenizer: Option<Tokenizer>,
    // 🔥 TRUE HYBRID: Ab hum Result aur Vector dono RAM mein rakhenge
    vector_store: std::sync::RwLock<Vec<(HyperSenseResult, Vec<f32>)>>,
}

impl HyperSenseEngine {
    pub fn new(index_path: &Path, schema: Schema) -> Self {
        let dir = tantivy::directory::MmapDirectory::open(index_path).unwrap();
        let index = Index::open_or_create(dir, schema).unwrap();
        let reader = index.reader().unwrap();

        let model_path = Path::new("C:/Users/Abhi/Desktop/Hyper_Dashboard/src-tauri/resources/models/minilm/model.safetensors");
        let config_path = Path::new("C:/Users/Abhi/Desktop/Hyper_Dashboard/src-tauri/resources/models/minilm/config.json");
        let tokenizer_path = Path::new("C:/Users/Abhi/Desktop/Hyper_Dashboard/src-tauri/resources/models/minilm/tokenizer.json");

        let (ai_model, tokenizer) = (|| {
            if !model_path.exists() || !config_path.exists() || !tokenizer_path.exists() {
                println!("⚠️ AI Model files missing! Hybrid search will gracefuly fallback to Text-Only mode.");
                return (None, None);
            }

            println!("🧠 Loading AI Model into Memory...");
            let config_str = std::fs::read_to_string(config_path).unwrap_or_default();
            let config: Config = serde_json::from_str(&config_str).unwrap_or_default();
            let vb = unsafe { VarBuilder::from_mmaped_safetensors(&[model_path], DTYPE, &Device::Cpu).unwrap() };
            let model = BertModel::load(vb, &config).unwrap();
            let tokenizer = Tokenizer::from_file(tokenizer_path).unwrap();

            println!("✅ AI Engine Successfully Loaded & Ready!");
            (Some(model), Some(tokenizer))
        })();

        Self { 
            index, reader, ai_model, tokenizer,
            vector_store: std::sync::RwLock::new(Vec::new()) // Start Empty
        }
    }

    fn get_embedding(&self, text: &str) -> Option<Vec<f32>> {
        if let (Some(model), Some(tokenizer)) = (&self.ai_model, &self.tokenizer) {
            let tokens = tokenizer.encode(text, true).ok()?;
            let token_ids = tokens.get_ids().to_vec();
            let token_tensor = Tensor::new(token_ids.as_slice(), &Device::Cpu).ok()?.unsqueeze(0).ok()?;
            
            let embeddings = model.forward(&token_tensor, &token_tensor.zeros_like().unwrap(), None).ok()?;
            let emb_vec: Vec<f32> = embeddings.mean(1).ok()?.flatten_all().ok()?.to_vec1().ok()?;
            Some(emb_vec)
        } else {
            None
        }
    }

    // 🔥 THE TRUE HYBRID SEARCH
    pub fn search(&self, query_str: &str) -> Vec<HyperSenseResult> {
        let mut final_results: HashMap<String, (f32, HyperSenseResult)> = HashMap::new();

        // 1. EXACT TEXT SEARCH (Tantivy) - For exact names and artists
        let searcher = self.reader.searcher();
        let schema = self.index.schema();
        let title_field = schema.get_field("title").unwrap();
        let subtitle_field = schema.get_field("subtitle").unwrap();
        
        let query_parser = QueryParser::for_index(&self.index, vec![title_field, subtitle_field]);
        if let Ok(query) = query_parser.parse_query(query_str) {
            if let Ok(top_docs) = searcher.search(&query, &TopDocs::with_limit(15)) {
                for (score, doc_address) in top_docs {
                    // 🔥 THE FIX: Explicit type TantivyDocument added here
                    let doc: TantivyDocument = searcher.doc(doc_address).unwrap();
                    let id = doc.get_first(schema.get_field("id").unwrap()).unwrap().as_str().unwrap().to_string();
                    
                    let result = HyperSenseResult {
                        id: id.clone(),
                        title: doc.get_first(title_field).unwrap().as_str().unwrap().to_string(),
                        subtitle: doc.get_first(subtitle_field).unwrap().as_str().unwrap().to_string(),
                        source: doc.get_first(schema.get_field("source").unwrap()).unwrap().as_str().unwrap().to_string(),
                        payload: doc.get_first(schema.get_field("payload").unwrap()).unwrap().as_str().unwrap().to_string(),
                    };
                    final_results.insert(id, (score, result));
                }
            }
        }

        // 2. VECTOR SEMANTIC SEARCH (Candle AI) - For Meaning ("Kala" = "Black")
        if let Some(q_vec) = self.get_embedding(query_str) {
            let store = self.vector_store.read().unwrap();
            
            for (doc, d_vec) in store.iter() {
                let dot_product: f32 = q_vec.iter().zip(d_vec.iter()).map(|(a, b)| a * b).sum();
                let q_norm: f32 = q_vec.iter().map(|a| a * a).sum::<f32>().sqrt();
                let d_norm: f32 = d_vec.iter().map(|a| a * a).sum::<f32>().sqrt();
                let cosine_sim = dot_product / (q_norm * d_norm);

                // Agar meaning thodi bhi match hoti hai (> 0.4 similarity)
                if cosine_sim > 0.4 {
                    let combined_score = cosine_sim * 10.0;
                    // Combine score if already exists from Text search
                    if let Some((existing_score, _)) = final_results.get_mut(&doc.id) {
                        *existing_score += combined_score;
                    } else {
                        final_results.insert(doc.id.clone(), (combined_score, doc.clone()));
                    }
                }
            }
        }

        // 3. Sort Results by Highest Score
        let mut sorted_results: Vec<(f32, HyperSenseResult)> = final_results.into_values().collect();
        sorted_results.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap());

        sorted_results.into_iter().take(15).map(|(_, res)| res).collect()
    }

    pub fn add_documents(&self, docs: Vec<HyperSenseResult>) -> Result<(), String> {
        let mut writer = self.index.writer(50_000_000).map_err(|e| e.to_string())?;
        let schema = self.index.schema();
        let mut store = self.vector_store.write().unwrap();
        
        // Purana cache clear karo taaki duplicate gaane na aayein
        store.clear();

        for doc in docs {
            let mut tantivy_doc = TantivyDocument::default();
            tantivy_doc.add_text(schema.get_field("id").unwrap(), &doc.id);
            tantivy_doc.add_text(schema.get_field("title").unwrap(), &doc.title);
            tantivy_doc.add_text(schema.get_field("subtitle").unwrap(), &doc.subtitle);
            tantivy_doc.add_text(schema.get_field("source").unwrap(), &doc.source);
            tantivy_doc.add_text(schema.get_field("payload").unwrap(), &doc.payload);
            writer.add_document(tantivy_doc).map_err(|e| e.to_string())?;

            // AI ke liye meaning banakar RAM mein store karo
            let context = format!("{} {}", doc.title, doc.subtitle);
            if let Some(embedding) = self.get_embedding(&context) {
                store.push((doc.clone(), embedding));
            }
        }

        writer.commit().map_err(|e| e.to_string())?;
        self.reader.reload().map_err(|e| e.to_string())?;
        Ok(())
    }
}