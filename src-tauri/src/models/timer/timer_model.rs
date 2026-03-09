use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Timer {
    pub id: u64,
    pub label: String,
    pub interval: u64,
}