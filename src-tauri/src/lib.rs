mod constants;
mod controllers;
mod models;
mod repositories;
mod services;

use std::sync::Arc;

use tauri::Manager;
use tauri_plugin_notification;
use tauri_plugin_store::StoreExt;

use controllers::timer::timer_controller::{get_timers, set_timers};
use repositories::timer::timer_repository::TimerRepository;
use services::countdown::countdown_service::CountdownService;
use services::notifications::notification_service::NotificationService;
use services::timer::timer_service::TimerService;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let app_handle = app.handle();

            app_handle.store("timers.json").expect("store init failed");

            let repository = Arc::new(TimerRepository::new(app_handle.clone()));
            let timer_service = TimerService::new(repository.clone());
            let notification_service = Arc::new(NotificationService::new(app_handle.clone()));
            let countdown_service =
                CountdownService::new(repository.clone(), notification_service.clone());

            app.manage(repository);
            app.manage(timer_service);
            app.manage(notification_service);
            app.manage(countdown_service);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_timers, set_timers])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
