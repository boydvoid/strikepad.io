#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::io::Write;
use std::process::Command;
use std::fs::File;
use postgres::{Client, NoTls};


#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error(transparent)]
    PostgresError(#[from] postgres::Error)
}

// we must manually implement serde::Serialize
impl serde::Serialize for CommandError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

pub type CommandResult<T, E = CommandError> = anyhow::Result<T, E> ;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn test_print(text: String) -> String {
    println!("{}", text);
    return text;
}

#[tauri::command]
fn run_javascript(code: &[u8]) -> String {
    let mut file = File::create("../generatedFiles/code.js").expect("Could not create file");
    file.write_all(code).expect("There was an error writing the file");
    let x = Command::new("node").arg("../generatedFiles/code.js").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}

#[tauri::command]
fn run_python(code: &[u8]) -> String {
    let mut file = File::create("../generatedFiles/code.py").expect("Could not create file");
    file.write_all(code).expect("There was an error writing the file");
    let x = Command::new("python3").arg("../generatedFiles/code.py").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}

#[tauri::command]
async fn run_postgres(code: String, user: &str, pass: &str) -> CommandResult<String, CommandError>{
    let url: String = format!("postgres://postgres:{}@localhost:5432/{}", pass, user);

    let query: String = code;
    println!("{}", query);
    let x = Command::new("psql")
        .arg("-d")
        .arg(url)
        .arg("-c")
        .arg(query)
        .output().expect("failed running code");

    let ret = format!("{}",String::from_utf8_lossy(&x.stdout).to_string());

    let mut new_ret = String::new();

    for char in ret.chars() {
        if char == ' ' {
            // pick the most random character
            new_ret.push('¶');
        } else {
            new_ret.push(char);
        }
    }

    println!("{}",new_ret);
    Ok(new_ret)
}

#[tauri::command]
fn javascript_check() -> String {
    let x = Command::new("node").arg("--version").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}

#[tauri::command]
fn python_check() -> String {
    let x = Command::new("python3").arg("--version").output().expect("failed running code");
    format!("{}", String::from_utf8_lossy(&x.stdout))
}


#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![test_print, run_javascript, run_python, run_postgres, javascript_check, python_check ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
