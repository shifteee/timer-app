use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Timer {
    pub label: String,
    pub interval: String,
}
