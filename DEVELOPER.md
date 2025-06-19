# Developer Documentation

## Project Overview

This is a Svelte + Vite portfolio project styled with Tailwind CSS. It features a terminal-like UI as the main interface, with interactive commands and a simulated file system.

## Folder Structure

- `src/` — Main source code
  - `App.svelte` — Main app component
  - `main.js` — Entry point
  - `app.css` — Global styles (Tailwind + custom)
  - `lib/Terminal.svelte` — Terminal UI logic and commands
  - `assets/` — Static assets (e.g., SVG)
- `public/` — Static files served as-is
  - `fonts/` — Custom fonts (Nerd Fonts)
  - `nginr.png` — Favicon/logo
- `index.html` — Main HTML file
- `package.json` — Project metadata and scripts
- `tailwind.config.js` — Tailwind CSS config
- `svelte.config.js` — Svelte config
- `vite.config.js` — Vite config
- `.vscode/` — Editor recommendations

## Main Dependencies

- `svelte` — UI framework
- `vite` — Build tool
- `tailwindcss` — Utility-first CSS
- `@sveltejs/vite-plugin-svelte` — Svelte integration for Vite
- `autoprefixer`, `postcss` — CSS tooling

## How It Works

- The app renders a terminal interface (`Terminal.svelte`) with commands like `help`, `ls`, `cat`, `cd`, etc.
- Simulated file system and command history are managed in component state.
- Custom fonts and colors are set via Tailwind and `app.css`.
- The terminal header shows live time and location (fetched from an API).

## Development

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (or as shown in terminal).

### Build
```bash
npm run build
```
Output will be in `dist/`.

### Preview Production Build
```bash
npm run preview
```

### Adding Features
- Add new commands in `src/lib/Terminal.svelte` under the `commands` object.
- Add new files or directories to the simulated file system in the same file.
- For new UI components, add them in `src/lib/` and import as needed.

### Styling
- Use Tailwind classes in Svelte files.
- Add or override styles in `src/app.css`.

### Fonts
- Custom fonts are in `public/fonts/` and loaded via `@font-face` in `app.css`.

### Tips
- Use VS Code with the Svelte extension for best experience.
- HMR is enabled for fast feedback.

---
For more details, see the comments in each file and the main `README.md`.
