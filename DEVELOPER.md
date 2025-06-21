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

- The core logic is contained in `src/lib/Terminal.svelte`. This component manages the UI, command history, and input handling. The two most important underlying systems are:

1.  **`src/lib/fileSystem.js`**: This utility is the heart of the modular content system. It uses Vite's `glob` import to automatically find all `.md` files within `src/content/`, builds a virtual file system tree, and stores the file contents. This means the terminal's file structure is generated dynamically at build time.

2.  **Command Object in `Terminal.svelte`**: A large `commands` object maps command strings (e.g., `ls`, `cat`) to the JavaScript functions that execute their logic. These functions interact with the dynamic file system provided by `fileSystem.js`.

- Custom fonts and colors are set via Tailwind and `app.css`.
- The terminal header shows live time and location (fetched from an API).

## Development Journey & Key Fixes

This section documents the major improvements and bug fixes implemented to bring the project to a stable and feature-rich state.

1.  **`cat` Command and Blog Mode Overhaul**:
    - **Initial Problem**: The `cat` command was critically broken. It would either silently fail or cause the entire UI to freeze when trying to read a file, especially a blog post. The user was unable to enter or exit the blog reading view.
    - **Fixes Implemented**:
        - **Asynchronous Parsing**: Correctly implemented `await` for `marked.parse()`, resolving the root cause of the UI freeze.
        - **Content Type Correction**: Modified `fileSystem.js` to store file content as a raw string instead of an array of lines, which was causing parsing failures.
        - **Robust Error Handling**: Added checks to prevent `cat` from trying to read directories or empty/whitespace-only files.
        - **Reliable Blog Mode**: Implemented robust keyboard event handling (`q` and `Escape`) to exit the article view and correctly managed DOM focus to ensure key presses were always captured.

2.  **UI/UX and Feature Enhancements**:
    - **Horizontal `ls` Output**: The `ls` command's output was changed from a vertical list to a horizontal, space-separated format, mimicking standard shell behavior and improving readability.
    - **Custom File Extensions**: To improve user experience, a display-only file extension system was created:
        - Blog posts (`.md`) are shown with a `.blog` extension.
        - Project files (`.md`) are shown with a `.md` extension.
        - Skill files (`.md`) are shown with no extension.
        - This was achieved without changing the underlying content management workflow, which still relies exclusively on `.md` files.
    - **Color Scheme Update**: The terminal's primary text color was changed from the default green to a more vibrant cyan (`#15f4ee`) for better aesthetics.
    - **Professional Footer**: Added a footer to the article view, featuring a dynamic copyright year and a linked signature with an avatar, pointing to the owner's GitHub profile.

3.  **Autocompletion Improvements**:
    - The autocompletion logic was enhanced to correctly handle path resolution, especially for the `home/` directory alias (`~`).

4.  **Project Re-branding**:
    - The project was renamed from "Nginr Portfolio" to "Nginr Terminal" to better reflect its nature. This change was applied to the HTML `<title>`, the welcome message, and the `neofetch` command output.

5.  **Improved Help and Documentation**:
    - The `help` command was updated with new tips, including how to use the `~` alias for the home directory.

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
- The file system is now **dynamic**. To add, edit, or remove content, you no longer need to touch the code in `Terminal.svelte`. Instead, you work directly with Markdown files in the `src/content/` directory.

### Adding a New Project

1.  Create a new file: `src/content/projects/your-project-name.md`
2.  Add your content in Markdown format.

That's it! The new project will automatically appear when you run `ls ~/projects`.

### Adding a New Skill

1.  Create a new file: `src/content/skills/your-skill-name.md`
2.  Describe the skill.

### Adding a Blog Post

1.  Create a new file: `src/content/blog/your-post-slug.md`
2.  Write your article. Using Markdown headings (`#`, `##`) will format it nicely in the special blog reader view.

### How `cat` Works with Blog Posts

When `cat` is used on a file inside `~/blog/`, it triggers a special "reader mode". The Markdown content is parsed by the `marked` library and displayed in a more readable, full-screen format instead of plain text in the terminal.

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
