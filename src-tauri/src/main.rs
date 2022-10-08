#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::io::Write;
use std::process::Command;
use std::fs::File;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn test_print(text: String) -> String {
    println!("{}", text);
    return text;
}

#[tauri::command]
fn run_js(code: &[u8]) -> String {
    let mut file = File::create("../generatedFiles/code.js").expect("Could not create file");
    file.write_all(code).expect("There was an error writing the file");
    let x = Command::new("node").arg("../generatedFiles/code.js").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}

#[tauri::command]
fn run_py(code: &[u8]) -> String {
    let mut file = File::create("../generatedFiles/code.py").expect("Could not create file");
    file.write_all(code).expect("There was an error writing the file");
    let x = Command::new("python3").arg("../generatedFiles/code.py").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}

#[tauri::command]
fn js_check() -> String {
    let x = Command::new("node").arg("--version").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}

#[tauri::command]
fn py_check() -> String {
    let x = Command::new("python3").arg("--version").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![test_print, run_js, run_py, js_check, py_check])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
