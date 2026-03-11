use std::collections::HashMap;

use tauri::State;

use crate::models::timer::timer_model::Timer;
use crate::services::countdown::countdown_service::CountdownService;
use crate::services::timer::timer_service::TimerService;

#[tauri::command]
pub async fn get_timers(
    service: State<'_, TimerService>,
) -> Result<HashMap<String, Timer>, String> {
    service.get_all().await
}

#[tauri::command]
pub async fn set_timers(
    value: HashMap<String, Timer>,
    timer_service: State<'_, TimerService>,
    countdown_service: State<'_, CountdownService>,
) -> Result<(), String> {
    timer_service.add(value).await?;
    countdown_service.start().await?;

    Ok(())
}
