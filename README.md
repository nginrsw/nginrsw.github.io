# Nginr Terminal

A personal portfolio web app with a terminal-inspired interface, built using Svelte, Vite, and Tailwind CSS.

## Features
- Terminal-like UI with interactive commands (help, ls, cat, cd, etc)
- Simulated file system and command history
- Custom fonts (Nerd Fonts) and retro terminal theme
- Live clock and location info in the header
- **Dynamic Content**: Add or edit projects, skills, and blog posts simply by creating Markdown files. The terminal automatically reflects the changes.
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

## Managing Content

This project uses a dynamic content system. You don't need to modify any Svelte code to add new entries. Simply add or edit Markdown (`.md`) files in the `src/content/` directory.

- **To Add a Blog Post**:
  - Create a new `.md` file in `src/content/blog/`.
  - It will automatically appear in the terminal with a `.blog` extension (e.g., `my-post.md` shows as `my-post.blog`).

- **To Add a Project**:
  - Create a new `.md` file in `src/content/projects/`.
  - It will appear in the terminal with a `.md` extension.

- **To Add a Skill**:
  - Create a new `.md` file in `src/content/skills/`.
  - It will appear in the terminal with no extension (e.g., `Svelte.md` shows as `Svelte`).

## Deploy to GitHub Pages

1. **Make sure your `vite.config.js` is correct:**
   - Set `base` to your repo name, for example:
     ```js
     export default defineConfig({
       base: '/', // change to your repo name
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
- `src/content/` — All modular content (about, projects, skills, blog) lives here as Markdown files.
- `src/lib/` — Core application logic, including the main `Terminal.svelte` component and the `fileSystem.js` utility.
- `public/` — Static assets (fonts, images).
- `DEVELOPER.md` — Technical documentation for developers.

## Customization
- **Add Content**: To add a new project, skill, or blog post, simply create a new `.md` file in the corresponding directory inside `src/content/`. The file system will update automatically.
- **Edit Commands**: Modify terminal commands in `src/lib/Terminal.svelte`.
- **Change Styles**: Adjust styles in `src/app.css` or via Tailwind.

## Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Svelte Extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

## License
- Fonts in `public/fonts/` are under the SIL Open Font License (see [LICENSE](/public/fonts/LICENSE) in that folder).
- The rest of the code is licensed under the MIT License, See [`LICENSE`](./LICENSE) in the root of this repository.

---
For more technical details, see [`DEVELOPER.md`](./DEVELOPER.md).
