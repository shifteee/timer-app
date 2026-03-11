use std::collections::HashMap;
use std::sync::Arc;

use crate::models::timer::timer_model::Timer;
use crate::repositories::timer::timer_repository::TimerRepository;

pub struct TimerService {
    repository: Arc<TimerRepository>,
}

impl TimerService {
    pub fn new(repository: Arc<TimerRepository>) -> Self {
        Self { repository }
    }

    pub async fn get_all(&self) -> Result<HashMap<String, Timer>, String> {
        let result: Result<HashMap<String, Timer>, String> = self.repository.get_all().await;

        result.map_err(|e: std::string::String| e.to_string())
    }

    pub async fn add(&self, timer: HashMap<String, Timer>) -> Result<(), String> {
        let result: Result<(), String> = self.repository.add(timer).await;

        result.map_err(|e| e.to_string())
    }
}
