use sysinfo::{CpuExt, System, SystemExt};

#[tauri::command]
pub fn system_info() -> String {
    let mut sys = System::new_all();

    sys.refresh_all();

    let cpu = sys.cpus()[0].brand();
    let mem = sys.total_memory();

    let returning = format!("{}+{}", cpu, mem);

    returning.into()
}
