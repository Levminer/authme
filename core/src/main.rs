#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(dead_code, unused_imports, unused_variables)]

use std::env;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconEvent},
    webview_version, Emitter, Manager,
};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};

mod auto_launch;
mod encryption;
mod utils;

#[derive(Clone, serde::Serialize)]
struct Payload {
    event: bool,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
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
            utils::random_values,
            utils::logger,
            utils::write_logs,
            utils::system_info,
            utils::google_authenticator_converter,
            utils::create_logs_dir,
        ])
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            let window = app.get_webview_window("main").unwrap();

            app.emit("openCodes", Payload { event: true.into() })
                .unwrap();

            window.show().unwrap();
            window.unminimize().unwrap();
            window.set_focus().unwrap();
        }))
        .setup(|app| {
            let webview_version = webview_version();

            if webview_version.is_err() {
                app.dialog()
                    .message(
                        "Please install Microsoft Edge WebView2 Runtime! \
                        (https://developer.microsoft.com/en-gb/microsoft-edge/webview2)",
                    )
                    .title("Failed to get webview version")
                    .kind(MessageDialogKind::Error)
                    .buttons(MessageDialogButtons::OkCustom("Exit".to_string()))
                    .blocking_show();

                app.app_handle().exit(0);
            }

            let window = app.get_webview_window("main").unwrap();

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
                }
            } else {
                window.maximize().unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }

            // Tray
            let toggle_window_item =
                MenuItemBuilder::with_id("toggle_windows", "Show/Hide Authme").build(app)?;
            let exit_item = MenuItemBuilder::with_id("exit", "Exit").build(app)?;
            let menu = MenuBuilder::new(app)
                .items(&[&toggle_window_item, &exit_item])
                .build()?;

            let tray = app.tray_by_id("main").unwrap();

            if cfg!(target_os = "windows") {
                tray.set_show_menu_on_left_click(false).unwrap();
            }

            tray.set_menu(Some(menu)).unwrap();
            tray.on_menu_event(move |app, event| match event.id().as_ref() {
                "toggle_windows" => {
                    let app = window.app_handle();
                    let window = app.get_webview_window("main").unwrap();
                    let window_visible = window.is_visible().unwrap();

                    if window_visible {
                        app.emit("openCodes", Payload { event: false }).unwrap();

                        window.hide().unwrap();
                    } else {
                        app.emit("openCodes", Payload { event: true }).unwrap();

                        window.show().unwrap();
                        window.unminimize().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                "exit" => {
                    app.exit(0);
                }
                _ => (),
            });

            if cfg!(target_os = "windows") {
                tray.on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        let window = app.get_webview_window("main").unwrap();
                        let window_visible = window.is_visible().unwrap();

                        if window_visible {
                            app.emit("openCodes", Payload { event: false }).unwrap();

                            window.hide().unwrap();
                        } else {
                            app.emit("openCodes", Payload { event: true }).unwrap();

                            window.show().unwrap();
                            window.unminimize().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                });
            }

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();

                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    window.show().unwrap();
                    window.unminimize().unwrap();
                    window.set_focus().unwrap();
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
