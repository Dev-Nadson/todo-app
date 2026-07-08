# Distribuição — ícone, build e instalação

Guia rápido para trocar o ícone do app, gerar os pacotes e instalar no Ubuntu.

## 1. Trocar o ícone

Os ícones ficam em [`src-tauri/icons/`](src-tauri/icons/) (vários tamanhos e formatos). O **ícone da
bandeja** reusa o ícone do app (`app.default_window_icon()` em `src-tauri/src/lib.rs`), então trocar
o ícone do app troca o da bandeja junto.

**Jeito recomendado — deixar o Tauri gerar todos os tamanhos:**

```bash
npm run tauri icon caminho/para/seu-icone.png
```

- Passe **um** PNG quadrado, de alta resolução (ideal **1024×1024**, fundo transparente).
- O comando regenera todos os arquivos em `src-tauri/icons/` (tamanhos + `.ico` + `.icns` +
  os `Square*Logo.png`).
- Depois rebuilde (`npm run tauri dev` ou `npm run tauri build`).

> **Dica p/ a bandeja:** o ícone aparece bem pequeno (~22px) no painel. Prefira um desenho simples
> e limpo — ícones muito detalhados ficam ruins nesse tamanho.

**Ícone da bandeja diferente do ícone do app (opcional):** troque, em
[`src-tauri/src/lib.rs`](src-tauri/src/lib.rs), a linha
`.icon(app.default_window_icon().unwrap().clone())` por
`.icon(tauri::image::Image::from_path("icons/tray.png")?)`, apontando para um arquivo dedicado.

## 2. Gerar os pacotes (build)

```bash
npm run tauri build
```

Compila o Rust em modo release e empacota. Os artefatos saem em:

```
src-tauri/target/release/bundle/
├── deb/todo-app_0.1.0_amd64.deb
├── rpm/todo-app-0.1.0-1.x86_64.rpm
└── appimage/todo-app_0.1.0_amd64.AppImage
```

> **Pré-requisito de sistema (bandeja):** `sudo apt install libayatana-appindicator3-dev`.

## 3. Instalar no Ubuntu

**Opção A — `.deb` (integra ao sistema, aparece no menu de apps):**

```bash
sudo apt install ./src-tauri/target/release/bundle/deb/todo-app_0.1.0_amd64.deb
```

Desinstalar: `sudo apt remove todo-app`.

**Opção B — `.AppImage` (portátil, não instala nada):**

```bash
chmod +x ./src-tauri/target/release/bundle/appimage/todo-app_0.1.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/todo-app_0.1.0_amd64.AppImage
```

> O executável cru também fica em `src-tauri/target/release/todo-app`.

## 4. Iniciar junto com o sistema (opcional)

Como é um app de bandeja, você provavelmente quer que ele suba no login.

**Via interface:** abra **"Aplicativos de Inicialização" / "Startup Applications"** e adicione o app.

**Via arquivo** — crie `~/.config/autostart/todo-app.desktop`:

```ini
[Desktop Entry]
Type=Application
Name=todo-app
Exec=todo-app
Icon=todo-app
X-GNOME-Autostart-enabled=true
```

(Se instalou o `.deb`, `Exec=todo-app` já funciona porque o binário fica em `/usr/bin`. Se usa o
AppImage, aponte o `Exec=` para o caminho completo do arquivo `.AppImage`.)
