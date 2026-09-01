use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use uuid::Uuid;
use crate::server::state::{AppState, LinkItem};

#[derive(Deserialize)]
pub struct CreateLinkPayload {
    pub title: String,
    pub url: String,
}

pub async fn get_links(State(state): State<AppState>) -> Json<Vec<LinkItem>> {
    let links = state.links.lock().unwrap().clone();
    Json(links)
}

pub async fn add_link(
    State(state): State<AppState>,
    Json(payload): Json<CreateLinkPayload>,
) -> impl IntoResponse {
    let mut links = state.links.lock().unwrap();
    let new_link = LinkItem {
        id: Uuid::new_v4().to_string(),
        title: payload.title,
        url: payload.url,
    };
    links.push(new_link);
    StatusCode::CREATED
}