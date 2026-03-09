use std::sync::Arc;

use tauri::{AppHandle, Wry};
use tauri_plugin_store::{Store, StoreExt};

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

    pub async fn get_all(&self) -> Result<Vec<Timer>, String> {
        let store_arc = self.store();
        let store = store_arc.as_ref();
        let mut timers: Vec<Timer> = Vec::new();

        for (_, value) in store.entries() {
            let value: serde_json::Value = value.clone();
            let timer: Timer = serde_json::from_value::<Timer>(value)
                .map_err(|e :serde_json::Error| e.to_string())?;

            timers.push(timer);
        }

        Ok(timers)
    }

    pub async fn get(&self, id: u64) -> Result<Option<Timer>, String> {
        let store = self.store();
        let key = id.to_string();

        if let Some(value) = store.get(key) {
            let value: serde_json::Value = value.clone();
            let timer: Timer = serde_json::from_value(value)
                .map_err(|e :serde_json::Error| e.to_string())?;

            return Ok(Some(timer));
        }

        Ok(None)
    }

    pub async fn add(&self, timer: Timer) -> Result<Timer, String> {
        let store = self.store();
        let key = timer.id.to_string();
        let value = serde_json::to_value(&timer)
            .map_err(|e :serde_json::Error| e.to_string())?;

        store.set(key, value);
        store.save().map_err(|e :tauri_plugin_store::Error| e.to_string())?;

        Ok(timer)
    }

    pub async fn remove(&self, id: u64) -> Result<(), String> {
        let store = self.store();
        let key = id.to_string();

        store.delete(key);
        store.save().map_err(|e :tauri_plugin_store::Error| e.to_string())?;

        Ok(())
    }

}