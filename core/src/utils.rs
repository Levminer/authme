use google_authenticator_converter::{process_data, Account};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use std::io::Write;
use std::{env, fs};
use sysinfo::System;
use tauri::{GlobalShortcutManager, Manager};

#[tauri::command]
pub fn get_args() -> Vec<String> {
    let args: Vec<String> = env::args().collect();

    args.into()
}

#[tauri::command]
pub fn update_tray(app: tauri::AppHandle) {
    let window = app.get_window("main").unwrap();
    let menu_item = app.tray_handle().get_item("toggle");

    if window.is_visible().unwrap() {
        menu_item.set_title("Show Authme").unwrap();
    } else {
        menu_item.set_title("Hide Authme").unwrap();
    }
}

#[tauri::command]
pub fn random_values(length: usize) -> String {
    let rand_string: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(length)
        .map(char::from)
        .collect();

    rand_string.into()
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

#[tauri::command]
pub fn write_logs(name: String, message: String) {
    let mut file = fs::OpenOptions::new()
        .write(true)
        .append(true)
        .create(true)
        .open(name)
        .unwrap();

    write!(file, "{}", message).unwrap();
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

    println!("{:?}", res);

    match res {
        Ok(accounts) => accounts,
        Err(_) => vec![],
    }
}
