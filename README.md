# Nginr Portfolio

A personal portfolio web app with a terminal-inspired interface, built using Svelte, Vite, and Tailwind CSS.

## Features
- Terminal-like UI with interactive commands (help, ls, cat, cd, etc)
- Simulated file system and command history
- Custom fonts (Nerd Fonts) and retro terminal theme
- Live clock and location info in the header
- Easily extensible: add your own commands, files, or directories

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open the local URL shown in the terminal (usually http://localhost:5173).

3. **Build for production:**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` folder.

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deploy to GitHub Pages

1. **Make sure your `vite.config.js` is correct:**
   - Set `base` to your repo name, for example:
     ```js
     export default defineConfig({
       base: '/nginr-portfolio/', // change to your repo name
       plugins: [svelte()],
     })
     ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Add a deploy script to `package.json`:**
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview",
     "deploy": "gh-pages -d dist"
   }
   ```

5. **Push all changes to GitHub.**

6. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

7. **Enable GitHub Pages in your repository:**
   - Go to your repo on GitHub → Settings → Pages.
   - Select the `gh-pages` branch and `/` (root) folder.
   - Save.

8. **Access your website:**
   - Wait a few minutes, then open:
     `https://<username>.github.io/<repo-name>/`

## Project Structure
- `src/` — Svelte components, main logic, and styles
- `public/` — Static assets (fonts, images)
- `DEVELOPER.md` — Technical documentation for developers
- `CONTRIBUTING.md` — Guide for forking and contributing

## Customization
- Add or edit terminal commands in `src/lib/Terminal.svelte`
- Change styles in `src/app.css` or via Tailwind
- Add new fonts to `public/fonts/`

## Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Svelte Extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

## License
- Fonts in `public/fonts/` are under the SIL Open Font License (see [LICENSE](/public/fonts/LICENSE) in that folder).
- The rest of the code is licensed under the MIT License, See [`LICENSE`](./LICENSE) in the root of this repository.

---
For more details, see [`DEVELOPER.md`](./DEVELOPER.md) and [`CONTRIBUTING.md`](./CONTRIBUTING.md).
