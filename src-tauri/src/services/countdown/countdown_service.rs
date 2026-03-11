use std::sync::Arc;
use std::thread;

use chrono::{DateTime, Duration, Utc};

use crate::models::timer::timer_model::Timer;
use crate::repositories::timer::timer_repository::TimerRepository;
use crate::services::notifications::notification_service::NotificationService;

pub struct CountdownService {
    repository: Arc<TimerRepository>,
    notification: Arc<NotificationService>,
}

impl CountdownService {
    pub fn new(repository: Arc<TimerRepository>, notification: Arc<NotificationService>) -> Self {
        Self {
            repository,
            notification,
        }
    }

    pub async fn start(&self) -> Result<(), String> {
        self.run_next_timer().await
    }

    async fn run_next_timer(&self) -> Result<(), String> {
        let timers = self.repository.get_all().await?;
        let now = Utc::now();

        // Parse active timers
        let mut active_timers: Vec<(Timer, Duration)> = vec![];

        for timer in timers.values() {
            let end_str = timer.interval.split('/').last().ok_or("Interval error")?;
            let end = DateTime::parse_from_rfc3339(end_str)
                .map_err(|e| format!("Failed to parse date: {}", e))?
                .with_timezone(&Utc);
            let delta = end - now;

            if delta.num_milliseconds() > 0 {
                active_timers.push((timer.clone(), delta));
            }
        }

        // Find the next timer
        let next_timer = active_timers.into_iter().min_by_key(|(_, delta)| *delta);

        if let Some((timer, delta)) = next_timer {
            println!("Next timer: {} in {:?}", timer.label, delta);

            let notification = self.notification.clone();
            let label = timer.label.clone();
            let service = self.clone_for_thread();

            // Spawn a thread for the timer
            thread::spawn(move || {
                let duration = delta.to_std().expect("Invalid duration");
                thread::sleep(duration);

                println!("Timer finished: {}", label);
                notification
                    .notify("Timer finished", &label)
                    .expect("notification error");

                // Automatically restart countdown after expiration
                // Use tokio::runtime to run async method from thread
                let rt = tokio::runtime::Runtime::new().expect("Failed to create runtime");
                rt.block_on(async move {
                    service.run_next_timer().await.ok();
                });
            });
        }

        Ok(())
    }

    fn clone_for_thread(&self) -> Arc<CountdownService> {
        Arc::new(CountdownService {
            repository: self.repository.clone(),
            notification: self.notification.clone(),
        })
    }
}
