// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, PhysicalPosition, WindowEvent,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Posiciona a janela no canto superior direito do monitor (perto da área da bandeja).
///
/// Nota: o protocolo AppIndicator não expõe a posição do ícone na barra, então não é
/// possível ancorar exatamente embaixo dele — o canto superior direito é a melhor aproximação.
fn position_top_right(window: &tauri::WebviewWindow) {
    const MARGIN: i32 = 8;
    let monitor = window
        .current_monitor()
        .ok()
        .flatten()
        .or_else(|| window.primary_monitor().ok().flatten());

    if let Some(monitor) = monitor {
        let screen = monitor.size();
        let origin = monitor.position();
        if let Ok(win) = window.outer_size() {
            let x = origin.x + screen.width as i32 - win.width as i32 - MARGIN;
            let y = origin.y + MARGIN;
            let _ = window.set_position(PhysicalPosition::new(x.max(origin.x), y));
        }
    }
}

/// Mostra e foca a janela principal, reposicionando perto do painel.
fn show_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        // Mostrar antes de posicionar: no X11/Mutter, mover uma janela ainda não
        // mapeada frequentemente é ignorado pelo gerenciador de janelas.
        let _ = window.show();
        position_top_right(&window);
        let _ = window.set_focus();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let show_item = MenuItem::with_id(app, "show", "Mostrar tarefas", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Sair", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("Tarefas")
                .menu(&menu)
                .show_menu_on_left_click(true)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => show_main_window(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| match event {
            // Oculta a janela ao perder o foco — clicar fora.
            WindowEvent::Focused(false) => {
                let _ = window.hide();
            }
            // Fechar a janela apenas oculta; o app continua na bandeja.
            WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
                let _ = window.hide();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
