use std::sync::Arc;

use crate::repositories::timer::timer_repository::TimerRepository;
use crate::models::timer::timer_model::Timer;

pub struct TimerService {
    repository: Arc<TimerRepository>,
}

impl TimerService {
    pub fn new(repository: Arc<TimerRepository>) -> Self {
        Self { repository }
    }

    pub async fn get_all(&self) -> Result<Vec<Timer>, String> {
        let result: Result<Vec<Timer>, String>  = self.repository
            .get_all()
            .await;
            
        result.map_err(|e :std::string::String| e.to_string())
    }

    pub async fn get(&self, id: u64) -> Result<Option<Timer>, String> {
        let result :Result<Option<Timer>, String> = self.repository.get(id).await;
            
        result.map_err(|e :std::string::String| e.to_string())
    }

    pub async fn add(&self, timer: Timer) -> Result<Timer, String> {
        let result :Result<Timer, String> = self.repository.add(timer).await;

        result
            .map_err(|e| e.to_string())
    }

    pub async fn remove(&self, id: u64) -> Result<(), String> {
        let result: Result<(), String> = self.repository.remove(id).await;

        result
            .map_err(|e| e.to_string())
    }

}