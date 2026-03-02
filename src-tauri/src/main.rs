// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_store::StoreBuilder;


// Learn more about Tauri commands at https://v1.tauri.app/v1/guides/features/command
#[tauri::command]
fn store_save(
    key: String,
    value: serde_json::Value,
    store: tauri::State<Store>
) -> Result<(), String> {
    let mut map = store.0.lock().unwrap();
    map.insert(key, value);
    
    Ok(())
}

#[tauri::command]
fn store_get(
    key: String,
    store: tauri::State<Store>
) -> Result<Option<serde_json::Value>, String> {
    let map = store.0.lock().unwrap();
    
    Ok(map.get(&key).cloned())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![store_save, store_get])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
