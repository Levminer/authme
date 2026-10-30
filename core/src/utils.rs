use google_authenticator_converter::{process_data, Account};
use serde::{Deserialize, Serialize};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::{env, fs};
use sysinfo::System;
use tauri::Manager;

#[tauri::command]
pub fn get_args() -> Vec<String> {
    let args: Vec<String> = env::args().collect();

    args.into()
}

#[tauri::command]
pub fn logger(message: String, time: String, kind: &str) {
    match kind {
        "log" => println!(
            "\x1b[32m[AUTHME LOG] \x1b[34m({}) \x1b[37m{}",
            time, message
        ),
        "warn" => println!(
            "\x1b[33m[AUTHME WARN] \x1b[34m({}) \x1b[37m{}",
            time, message
        ),
        "error" => println!(
            "\x1b[31m[AUTHME ERROR] \x1b[34m({}) \x1b[37m{}",
            time, message
        ),
        &_ => println!(
            "\x1b[31m[AUTHME LOG] \x1b[34m({}) \x1b[37m{}",
            time, message
        ),
    }
}

fn logs_dir(app: &tauri::AppHandle) -> PathBuf {
    app.path().app_cache_dir().unwrap().join("logs")
}

#[tauri::command]
pub fn create_logs_dir(app: tauri::AppHandle) {
    fs::create_dir_all(logs_dir(&app)).unwrap();
}

#[tauri::command]
pub fn write_logs(app: tauri::AppHandle, name: String, message: String) -> Result<(), String> {
    let file_name = Path::new(&name)
        .file_name()
        .filter(|file_name| *file_name == name.as_str() && name.ends_with(".log"))
        .ok_or("Invalid log file name")?;

    let mut file = fs::OpenOptions::new()
        .append(true)
        .create(true)
        .open(logs_dir(&app).join(file_name))
        .map_err(|error| error.to_string())?;

    write!(file, "{}", message).map_err(|error| error.to_string())
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemInfo {
    pub os_name: String,
    pub os_arch: String,
    pub cpu_name: String,
    pub total_mem: u64,
}

#[tauri::command]
pub fn system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();

    let mut os_name = System::name().unwrap();
    let mut os_arch = env::consts::ARCH.to_string();
    let cpu_name = sys.cpus()[0].brand().to_string();
    let total_mem = sys.total_memory();

    os_name = match os_name.as_str() {
        "Darwin" => "macOS".to_string(),
        _ => os_name,
    };

    os_arch = match os_arch.as_str() {
        "x86_64" => "x64".to_string(),
        "aarch64" => "arm64".to_string(),
        _ => os_arch,
    };

    let res = SystemInfo {
        os_name,
        cpu_name,
        total_mem,
        os_arch,
    };

    res.into()
}

#[tauri::command]
pub fn google_authenticator_converter(secret: &str) -> Vec<Account> {
    let res = process_data(secret);

    match res {
        Ok(accounts) => accounts,
        Err(_) => vec![],
    }
}
