mod controllers;
mod models;
mod repositories;
mod services;

use std::sync::Arc;

use tauri::Manager;
use tauri_plugin_store::StoreExt;

use controllers::timer::timer_controller;
use repositories::timer::timer_repository::TimerRepository;
use services::timer::timer_service::TimerService;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let app_handle = app.handle().clone();

            app_handle.store("timers.json").expect("store init failed");

            let repository = Arc::new(TimerRepository::new(app_handle));
            let service = TimerService::new(repository.clone());

            app.manage(repository);
            app.manage(service);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![timer_controller::get_timers,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
