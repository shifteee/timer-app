use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

pub struct NotificationService {
    app: AppHandle,
}

impl NotificationService {
    pub fn new(app: AppHandle) -> Self {
        Self { app }
    }

    pub fn notify(&self, title: &str, body: &str) -> Result<(), String> {
        self.app
            .notification()
            .builder()
            .title(title)
            .body(body)
            .sound("default")
            .show()
            .map_err(|e| e.to_string())
    }
}
