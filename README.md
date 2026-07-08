# ToDo-app

Um gerenciador de tarefas **de bandeja (system tray)** para o desktop — leve, sempre à mão, feito
com Tauri + React.

---

## 📌 O que é

O **ToDo-app** é um aplicativo de lista de tarefas que vive na **área de notificação do sistema**
(ao lado do relógio/Discord/wifi), em vez de ocupar espaço como uma janela comum.

**Problema que resolve:** apps de tarefas tradicionais exigem abrir uma janela grande, trocar de
contexto ou acessar um site. Aqui, suas tarefas ficam a **um clique** no painel do sistema: abre
uma janelinha flutuante, você anota/consulta/conclui e ela **some sozinha ao clicar fora** — sem
poluir a barra de tarefas nem atrapalhar o fluxo.

**Funcionalidades:**
- Criar tarefas com título (obrigatório) e descrição.
- Marcar como concluída/pendente (com seção separada de concluídas).
- Ver detalhes de uma tarefa e excluí-la.
- **Reordenar** as pendentes por arrastar-e-soltar.
- **Persistência local** — os dados sobrevivem ao fechar/reabrir o app.
- Ícone na bandeja com menu (Mostrar / Sair) e janela flutuante frameless.

---

## 🧰 Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Shell desktop | [Tauri v2](https://tauri.app) (Rust) |
| UI | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Bundler/dev | [Vite](https://vite.dev) |
| Estilo | [Tailwind CSS v4](https://tailwindcss.com) (design tokens via `@theme`) |
| Roteamento | [TanStack Router](https://tanstack.com/router) (file-based, memory history) |
| Variantes de componente | [class-variance-authority](https://cva.style) + `clsx` + `tailwind-merge` |
| Ícones | [lucide-react](https://lucide.dev) |
| Fonte | [Cantarell](https://fonts.google.com/specimen/Cantarell) (via `@fontsource`) |
| Drag-and-drop | [@dnd-kit](https://dndkit.com) |
| Persistência | [`@tauri-apps/plugin-store`](https://v2.tauri.app/plugin/store/) (key-value em JSON) |

---

## 🏛️ Arquitetura de software

O app tem dois lados que se comunicam pela ponte do Tauri:

```
┌─────────────────────────────────────────────┐   ┌──────────────────────────┐
│  Frontend (WebView) — React + TS            │   │  Backend — Rust (Tauri)  │
│                                              │   │                          │
│  routes/  →  components/  →  services/tasks  │◄─►│  lib.rs                  │
│  (telas)     (UI)           (Create/List/    │   │  • tray icon + menu      │
│                              Get/Delete/      │   │  • janela (show/hide/    │
│                              toggle/reorder)  │   │    posição, blur→hide)   │
│                                   │           │   │  • plugin-store (Rust)   │
└───────────────────────────────────┼──────────┘   └────────────┬─────────────┘
                                     │                            │
                                     └──────────►  tasks.json  ◄──┘
                                              (arquivo no disco)
```

### Frontend (`src/`)
- **`routes/`** — roteamento por arquivos do TanStack Router. `index.tsx` (`/` lista),
  `create.tsx` (`/create`), `$id.tsx` (`/$id` detalhes), `__root.tsx` (layout). A árvore
  `routeTree.gen.ts` é **gerada** pelo plugin do Vite (não editar à mão).
- **`components/`** — as telas (`list-tasks`, `create-task`, `get-task`).
- **`components/ui/`** — design system reutilizável: `button` (com `cva`), `input`, `textarea`,
  `checkbox`, `badge`, `task-item`, `task-list`, `field-label`, `empty-state`, `header`,
  `app-container`.
- **`services/tasks.ts`** — única camada de acesso a dados. Expõe `createTask`, `listTasks`,
  `getTask`, `deleteTask`, `toggleTask`, `reorderTasks` sobre o plugin-store. Trocar o backend de
  dados no futuro é isolado aqui.
- **`typings/tasks.ts`** — tipos (`Task`, `CreateTaskInput`).
- **`lib/utils.ts`** — helper `cn()` (merge de classes Tailwind).
- **`App.css`** — tokens do design system (cores, tipografia, sombras) em `@theme` do Tailwind v4.

### Backend (`src-tauri/`)
- **`src/lib.rs`** — cria o ícone de bandeja e o menu; controla a janela (mostrar, ocultar ao
  perder foco, posicionar perto do painel; fechar apenas oculta); registra o plugin-store.
- **`tauri.conf.json`** — janela frameless, transparente, `visible:false`, `skipTaskbar`,
  `alwaysOnTop`; permissões e bundle.
- **`capabilities/`** — permissões (store, opener, core).

### Fluxo de dados
Componentes React chamam funções de `services/tasks.ts` → plugin-store (JS) → plugin-store (Rust)
→ arquivo `tasks.json` no diretório de dados do app. A ordenação manual é persistida no campo
`order` de cada tarefa.

---

## 💻 Rodar localmente (contribuir e testar)

### Pré-requisitos
- **Node.js** 18+ (recomendado 20+) e npm.
- **Rust** (via [rustup](https://rustup.rs)) — toolchain estável.
- **Dependências de sistema do Tauri** — ver o
  [guia oficial de pré-requisitos](https://v2.tauri.app/start/prerequisites/).
  - **Linux (Ubuntu/Debian):** além das libs do WebKitGTK, para o ícone de bandeja instale:
    ```bash
    sudo apt install libayatana-appindicator3-dev
    ```

### Passos
```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento (hot-reload no front, recompila o Rust quando muda)
npm run tauri dev
```

Scripts úteis:
| Comando | O que faz |
|---|---|
| `npm run tauri dev` | Sobe o app completo (front + Rust) em modo dev |
| `npm run dev` | Só o frontend no navegador (Vite) — útil para UI pura |
| `npm run build` | `tsc` + build do frontend (checagem de tipos) |
| `npm run tauri build` | Gera os instaladores/pacotes de produção |

> **Nota:** o app inicia **sem janela visível**. Após subir, procure o **ícone na bandeja** do
> sistema e clique nele → **"Mostrar tarefas"**.

---

## 📦 Instalar permanentemente

Primeiro gere os pacotes:
```bash
npm run tauri build
```
Os artefatos saem em `src-tauri/target/release/bundle/`.
Detalhes adicionais (trocar ícone, autostart) estão em [DISTRIBUICAO.md](DISTRIBUICAO.md).

### 🐧 Linux
Pré-requisito de build: `sudo apt install libayatana-appindicator3-dev`.

**Opção A — pacote `.deb` (integra ao sistema, aparece no menu de apps):**
```bash
sudo apt install ./src-tauri/target/release/bundle/deb/todo-app_0.1.0_amd64.deb
# desinstalar: sudo apt remove ToDo-app
```

**Opção B — `.AppImage` (portátil, não instala nada):**
```bash
chmod +x ./src-tauri/target/release/bundle/appimage/todo-app_0.1.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/todo-app_0.1.0_amd64.AppImage
```

**Iniciar no login (opcional):** adicione o app em *Aplicativos de Inicialização* ou crie
`~/.config/autostart/ToDo-app.desktop` (exemplo em [DISTRIBUICAO.md](DISTRIBUICAO.md)).

> O ícone de bandeja no GNOME depende da extensão **AppIndicator** (já habilitada por padrão no
> Ubuntu). No Linux, clicar no ícone abre o **menu** — limitação do protocolo AppIndicator.

### 🪟 Windows
O build para Windows precisa ser feito **em uma máquina Windows** (com Rust + Microsoft C++ Build
Tools + WebView2, conforme os pré-requisitos do Tauri). Rodando `npm run tauri build` lá, são
gerados:

- **Instalador MSI** — `src-tauri/target/release/bundle/msi/ToDo-app_0.1.0_x64_en-US.msi`
- **Instalador NSIS (.exe)** — `src-tauri/target/release/bundle/nsis/ToDo-app_0.1.0_x64-setup.exe`

Basta executar o `.msi` (ou o `.exe` de setup) e seguir o assistente — o app é instalado e passa a
aparecer no menu Iniciar.

**Iniciar no login (opcional):** coloque um atalho do app na pasta de inicialização
(`Win + R` → `shell:startup`).

> No Windows a bandeja funciona de forma mais rica: **clicar no ícone** pode abrir a janela
> diretamente (eventos de clique são suportados, ao contrário do Linux).

---

## 📄 Licença

Projeto pessoal/educacional. Ajuste esta seção conforme necessário.
