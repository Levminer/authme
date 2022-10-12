use auto_launch::*;
use std::env;

#[tauri::command]
pub fn auto_launch() {
    let exe = env::current_exe().unwrap();
    let exe_string = exe.to_str().unwrap();

    let auto = AutoLaunchBuilder::new()
        .set_app_name("Authme v4")
        .set_app_path(exe_string)
        .set_use_launch_agent(false)
        .set_args(&["--minimized"])
        .build()
        .unwrap();

    let enabled = auto.is_enabled().unwrap();

    if enabled == false {
        auto.enable().unwrap();
    } else {
        auto.disable().unwrap();
    }
}
