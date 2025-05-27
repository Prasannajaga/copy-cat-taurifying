// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use active_win_pos_rs::get_active_window;
use serde::Serialize;
use std::env;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use tauri::Manager;
use tauri_plugin_clipboard::Clipboard;

#[derive(Serialize)]
struct ClipboardData {
    text: String,
    source: String,
} 

fn get_temp_directory() -> PathBuf {
    let temp_dir = PathBuf::from("D:\\temp"); // Change this to your preferred directory
    if !temp_dir.exists() {
        std::fs::create_dir_all(&temp_dir).expect("Failed to create temp directory");
    }
    temp_dir
}
 
#[tauri::command]
async fn get_clipboard_text(app: tauri::AppHandle) -> Result<ClipboardData, String> {
    let clipboard = app.state::<Clipboard>(); 
    
    let text = match clipboard.read_text() {
        Ok(t) => t,
        Err(_) => "empty".to_string(),
    };

    let source = match get_active_window() {
        Ok(window) => window.app_name,
        Err(_) => "Unknown".to_string(),
    };
 

    Ok(ClipboardData { text, source })
}

#[tauri::command]
async fn set_clipboard_text(app: tauri::AppHandle, text: String) -> Result<(), String> {
    let clipboard = app.state::<Clipboard>();
    clipboard.write_text(text).map_err(|e| e.to_string())
}

#[tauri::command]
async fn clear_clipboard(app: tauri::AppHandle) -> Result<(), String> {
    let clipboard: tauri::State<'_, Clipboard> = app.state::<Clipboard>();
    clipboard.clear().map_err(|e| e.to_string())
}

#[tauri::command]
async fn open_vscode(content: String, param1: String) {
    // Get the temporary directory path
    let temp_dir = get_temp_directory();
    let file_path = temp_dir.join(param1);

    // Write clipboard content to a temporary file
    if let Err(err) = fs::write(&file_path, content) {
        eprintln!("Failed to write file: {}", err);
        return;
    }
    println!("{}" , file_path.display());
    println!("{}" , temp_dir.display());
    // let vs_path: &str = "C:\\Users\\prasa\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe";

    // Open VS Code with the file
    // let _output = Command::new("cmd")
    //     .args(&["/C", vs_path, file_path.to_str().unwrap()])
    //     .spawn()
    //     .expect("Failed to open VS Code");

    let _output = Command::new("cmd")
        .args(&["/C", "code ", file_path.to_str().unwrap()])
        .spawn()
        // .arg(file_path.to_str().unwrap()) // Pass the file path to VS Code
         .expect("Failed to open VS Code");

    println!("VS Code is opening in {}", temp_dir.display());

    // "Sucess"
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build()) 
        .plugin(tauri_plugin_notification::init()) 
        // listen for all events is here 
        // .setup(|app| {
        //     #[cfg(desktop)]
        //     {
        //         use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
        //         let handle = app.handle();
        //         let ctrl_n_shortcut = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::SHIFT), Code::KeyZ);

        //         handle.plugin(
        //             tauri_plugin_global_shortcut::Builder::new().with_handler(move |_app, shortcut, event| {
        //                 println!("{:?}", shortcut);
        //                 if shortcut == &ctrl_n_shortcut {
        //                     match event.state() {
        //                       ShortcutState::Pressed => {
        //                         println!("Print happend"); 
        //                       }
        //                       ShortcutState::Released => {
        //                         println!("Print happend"); 
        //                       }
        //                     }
        //                 }
        //             })
        //             .build(),
        //         )?;

        //         app.global_shortcut().register(ctrl_n_shortcut)?;
        //     }
        //     Ok(()) 
        // })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![
            get_clipboard_text,
            set_clipboard_text,
            open_vscode,
            clear_clipboard
        ])
        .setup(|app| {

            use tauri_plugin_notification::NotificationExt;
            app.notification()
                .builder()
                .title("copy_cat")
                .body("press CONTROL+SHIFT+Z to see it")
                .show()
                .unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
