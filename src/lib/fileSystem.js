// src/lib/fileSystem.js

// Use Vite's glob import to get all markdown files in the content directory
const modules = import.meta.glob('/src/content/**/*.md', { as: 'raw', eager: true });

const fileSystem = {
  '~': { type: 'dir', children: {} }
};
const fileContents = {};

for (const path in modules) {
  // Get the raw content
  // Get the raw content and trim whitespace to handle empty/whitespace-only files
  const content = (modules[path] || '').trim();
  
  // Clean up the path to be relative to '/src/content'
  // e.g., /src/content/blog/welcome.md -> blog/welcome.md
  const cleanPath = path.replace('/src/content/', '');
  
  // Store content with a full virtual path key
  const virtualPath = `~/${cleanPath.replace('.md', '')}`;
  fileContents[virtualPath] = content;

  // Build the file system tree
  const parts = cleanPath.split('/');
  let currentLevel = fileSystem['~'].children;
  let currentDirPath = '~';

  parts.forEach((part, index) => {
    const isFile = index === parts.length - 1;

    if (isFile) {
      const nameWithoutExt = part.replace('.md', '');
      let displayName;
      
      if (nameWithoutExt === 'about') {
        displayName = 'about-me.xr';
      } else if (cleanPath.startsWith('blog/')) {
        displayName = `${nameWithoutExt}.blog`;
      } else if (cleanPath.startsWith('skills/')) {
        displayName = nameWithoutExt; // No extension for skills
      } else {
        displayName = `${nameWithoutExt}.md`;
      }
      currentLevel[displayName] = { type: 'file' };
    } else { // It's a directory
      const name = part;
      if (!currentLevel[name]) {
        currentLevel[name] = { type: 'dir', children: {} };
        const newDirPath = currentDirPath === '~' ? `~/${name}` : `${currentDirPath}/${name}`;
        fileSystem[newDirPath] = { type: 'dir', children: currentLevel[name].children };
      }
      currentLevel = currentLevel[name].children;
      currentDirPath = currentDirPath === '~' ? `~/${name}` : `${currentDirPath}/${name}`;
    }
  });
}

/**
 * Resolves a given path from a current directory.
 * Supports '.', '..', '~', absolute and relative paths.
 * @param {string} currentPath - The current directory path (e.g., '~/projects').
 * @param {string} targetPath - The target path to resolve (e.g., '../skills', 'new-dir', '/~/blog').
 * @returns {{path: string | null, error: string | null}}
 */
export function resolvePath(currentPath, targetPath) {
  // Handle absolute paths first
  if (targetPath.startsWith('~') || targetPath.startsWith('home')) {
    currentPath = '~'; // Reset base to home
    targetPath = targetPath.replace(/^(\~\/?|home\/?)/, '');
  }

  // If target is empty after stripping home, it means we are going to home dir
  if (targetPath === '') {
      return { path: '~', error: null };
  }

  const parts = targetPath.split('/').filter(p => p && p !== '.');
  let pathSegments = currentPath === '~' ? ['~'] : currentPath.split('/');

  for (const part of parts) {
    if (part === '..') {
      if (pathSegments.length > 1) { // Can't go above `~`
        pathSegments.pop();
      }
    } else {
      pathSegments.push(part);
    }
  }

  let finalPath = pathSegments.join('/');
  if (finalPath === '') finalPath = '~';
  // Normalize path: remove trailing slash if it's not the root '~/'
  if (finalPath.length > 1 && finalPath.endsWith('/')) {
      finalPath = finalPath.slice(0, -1);
  }

  // The function should not be responsible for full validation, 
  // as it's also used for autocompletion of partial paths.
  // The command executor will do the final validation.
  return { path: finalPath, error: null };
}

export { fileSystem, fileContents };
