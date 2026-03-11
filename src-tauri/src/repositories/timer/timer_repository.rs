use std::sync::Arc;
use std::collections::HashMap;

use tauri::{AppHandle, Wry};
use tauri_plugin_store::{Store, StoreExt};

use crate::constants::STORE_NAME;
use crate::models::timer::timer_model::Timer;

pub struct TimerRepository {
    app: AppHandle,
}

impl TimerRepository {
    pub fn new(app: AppHandle) -> Self {
        Self { app }
    }

    fn store(&self) -> Arc<Store<Wry>> {
        self.app.store("timers.json").unwrap()
    }

    pub async fn get_all(&self) -> Result<HashMap<String, Timer>, String> {
        let store = self.store();
        let stored_data = store.get(STORE_NAME)
            .expect("Failed to get value from store");
        
        let result :HashMap<String, Timer> = serde_json::from_value(stored_data.clone())
            .map_err(|e| e.to_string())?;

        Ok(result)
    }

    pub async fn add(&self, timer: HashMap<String, Timer>,) -> Result<(), String> {
        let store = self.store();
        let value = serde_json::to_value(&timer)
            .map_err(|e :serde_json::Error| e.to_string())?;

        store.set(STORE_NAME, value);
        store.save().map_err(|e :tauri_plugin_store::Error| e.to_string())?;

        Ok(())
    }

}