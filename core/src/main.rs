#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(dead_code, unused_imports, unused_variables)]

use std::env;
use tauri::*;

mod auto_launch;
mod encryption;
mod utils;

#[derive(Clone, serde::Serialize)]
struct Payload {
    event: bool,
}

fn make_tray() -> SystemTray {
    let menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("toggle".to_string(), "Hide Authme"))
        .add_item(CustomMenuItem::new("exit".to_string(), "Exit Authme"));
    return SystemTray::new().with_menu(menu);
}

fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    let toggle_window = |app: AppHandle| -> () {
        let window = app.get_window("main").unwrap();
        let menu_item = app.tray_handle().get_item("toggle");
        let window_visible = window.is_visible().unwrap();

        if window_visible {
            app.emit_all("openCodes", Payload { event: false }).unwrap();

            window.hide().unwrap();
            menu_item.set_title("Show Authme").unwrap();
        } else {
            app.emit_all("openCodes", Payload { event: true }).unwrap();

            window.show().unwrap();
            window.unminimize().unwrap();
            window.set_focus().unwrap();

            menu_item.set_title("Hide Authme").unwrap();
        }
    };

    if let SystemTrayEvent::LeftClick { position, size, .. } = event {
        if cfg!(target_os = "windows") {
            toggle_window(app.clone())
        }
    }

    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        if id.as_str() == "exit" {
            std::process::exit(0);
        }

        if id.as_str() == "toggle" {
            toggle_window(app.clone())
        }
    }
}

fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            auto_launch::enable_auto_launch,
            auto_launch::disable_auto_launch,
            encryption::encrypt_password,
            encryption::verify_password,
            encryption::encrypt_data,
            encryption::decrypt_data,
            encryption::set_entry,
            encryption::get_entry,
            encryption::receive_encryption_key,
            encryption::set_encryption_key,
            encryption::delete_entry,
            utils::get_args,
            utils::update_tray,
            utils::random_values,
            utils::logger,
            utils::write_logs,
            utils::system_info,
            utils::google_authenticator_converter,
        ])
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            let window = app.get_window("main").unwrap();

            app.emit_all("openCodes", Payload { event: true.into() })
                .unwrap();

            window.show().unwrap();
            window.unminimize().unwrap();
            window.set_focus().unwrap();
        }))
        .system_tray(make_tray())
        .on_system_tray_event(handle_tray_event)
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            // Launch args
            let args: Vec<String> = env::args().collect();

            // Show window if auto launch argument not detected
            if args.len() >= 2 {
                if args[1] != "--minimized" {
                    window.maximize().unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                } else {
                    window.maximize().unwrap();

                    let menu_item = app.tray_handle().get_item("toggle");
                    menu_item.set_title("Show Authme").unwrap();
                }
            } else {
                window.maximize().unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }

            Ok(())
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
                let app = event.window().app_handle();

                let window = app.get_window("main").unwrap();
                let menu_item = app.tray_handle().get_item("toggle");

                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                    menu_item.set_title("Show Authme").unwrap();
                } else {
                    window.show().unwrap();
                    window.unminimize().unwrap();
                    window.set_focus().unwrap();

                    menu_item.set_title("Hide Authme").unwrap();
                }
            }
            _ => {}
        })
        .run(context)
        .expect("error while running tauri application");
}
