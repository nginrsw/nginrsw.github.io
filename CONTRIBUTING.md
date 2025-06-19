# Contributing & Fork Guide

Thank you for your interest in forking or contributing to this project!

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/nginr-portfolio.git
   cd nginr-portfolio
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the dev server**:
   ```bash
   npm run dev
   ```

## What You Can Change

- **Terminal Commands**: Add, remove, or modify commands in `src/lib/Terminal.svelte` (see the `commands` object).
- **Simulated File System**: Add new files or directories in the `fileSystem` object in `Terminal.svelte`.
- **UI/UX**: Change styles in `src/app.css` or add new Svelte components in `src/lib/`.
- **Fonts/Assets**: Add new fonts to `public/fonts/` or images to `public/`.
- **Configuration**: Adjust Tailwind, Svelte, or Vite settings in their respective config files.

## How to Add a New Command
1. Open `src/lib/Terminal.svelte`.
2. In the `commands` object, add a new entry:
   ```js
   newcommand: (args) => [/* your output here */],
   ```
3. (Optional) Add autocomplete logic in the `handleKeydown` function.

## How to Add a New File/Directory
1. Update the `fileSystem` object in `Terminal.svelte`:
   ```js
   '~/newdir': ['file1.txt'],
   ```
2. Add file content in the `fileContents` object if needed.

## Submitting Changes
1. Commit your changes with a clear message.
2. Push to your fork:
   ```bash
   git push origin main
   ```
3. Open a Pull Request (PR) to the original repository.

## Contribution Rules
- Keep code clean and well-commented.
- Test your changes before submitting.
- For major changes, open an issue first to discuss.
- Respect the existing code style and structure.

## Customization Ideas
- Add more terminal commands (e.g., `whois`, `contact`, `theme` switcher).
- Improve the simulated file system.
- Add animations or sound effects.
- Localize for other languages.

## License
- Fonts in `public/fonts/` are under the SIL Open Font License (see `LICENSE` in that folder).
- The rest of the code is under the license specified in the main repository (add one if missing).

---
Happy hacking! If you have questions, open an issue or discussion on GitHub.
