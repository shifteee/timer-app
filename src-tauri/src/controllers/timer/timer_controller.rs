use tauri::State;
use crate::services::timer::timer_service::TimerService;
use crate::models::timer::timer_model::Timer;

#[tauri::command]
pub async fn get_timers(
    service: State<'_, TimerService>
) -> Result<Vec<Timer>, String> {

    service.get_all().await
}
