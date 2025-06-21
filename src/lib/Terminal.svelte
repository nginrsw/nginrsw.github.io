<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { marked } from 'marked';
  import { fileSystem, fileContents, resolvePath } from '../lib/fileSystem.js';

  let terminalHistory = [];
  let command = '';
  let inputRef;
  let containerRef;
  let articleViewRef; // Ref for the article view div
  let currentPath = '~';
  let commandHistory = [];
  let commandHistoryIndex = 0;
  let currentTime = new Date();
  let userLocation = 'locating...';
  let clockInterval;
  let startTime = new Date();

  // State for blog reading mode
  let isReadingArticle = false;
  let articleContent = '';

  const commands = {
    help: () => ['Available commands:', '  help              ——— Shows this help message.', '  ls <dir>          ——— Lists files and directories.', '  pwd               ——— Shows the current directory path.', '  cd <dir>          ——— Changes the current directory.', '  cat <file>        ——— Displays the content of a file.', '  whoami            ——— Displays the current user.', '  date              ——— Displays the current date and time.', '  neofetch          ——— Displays system information.', '  clear             ——— Clears the terminal screen.', '  exit              ——— Closes the terminal session.', '', 'Tips:', '  - Use Tab for autocompletion.', '  - Use Arrow Up/Down to navigate command history.', "  - '~' is an alias for the home directory (e.g., 'cd ~').", '  - In blog view, press `q` or `Escape` to return to the terminal.'],
    whoami: () => ['guest'],
    date: () => [new Date().toString()],
    neofetch: () => {
      const now = new Date();
      const uptimeMs = now.getTime() - startTime.getTime();
      const seconds = Math.floor((uptimeMs / 1000) % 60);
      const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
      const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
      let uptimeString = '';
      if (hours > 0) uptimeString += `${hours}h `;
      if (minutes > 0) uptimeString += `${minutes}m `;
      uptimeString += `${seconds}s`;
      return ['    ▘         ', '▛▌▛▌▌▛▌▛▘▛▘▌▌▌', '▌▌▙▌▌▌▌▌ ▄▌▚▚▘', '  ▄▌          ', '', 'guest@nginr-terminal', '---------------------', 'OS: Nginr Web OS', 'Host: Nginr Terminal', 'Kernel: 6.9.0-svelte', `Uptime: ${uptimeString}`, 'Shell: port-sh', 'Font: 0xProto'];
    },
    ls: (args) => {
      const target = args[0] || '.';
      const { path: resolvedPath, error } = resolvePath(currentPath, target);
      if (error) return [error];
      const node = fileSystem[resolvedPath];
      if (!node) return [`ls: cannot access '${target}': No such file or directory`];
      if (node.type === 'file') {
        return [target.split('/').pop()];
      }
      if (node.type === 'dir') {
        const children = node.children;
        if (Object.keys(children).length === 0) return [];
        const items = Object.keys(children).map(name => {
          return children[name].type === 'dir' ? `${name}/` : name;
        });
        return [items.join('  ')];
      }
      return [];
    },
    pwd: () => [displayPath(currentPath)],
    cat: async (args) => {
      const rawFileName = args[0];
      if (!rawFileName) return ['cat: missing operand'];

      let logicalFileName = rawFileName;
      if (rawFileName === 'about-me.xr') {
        logicalFileName = 'about';
      } else {
        const extensions = ['.md', '.blog', '.xr'];
        for (const ext of extensions) {
          if (logicalFileName.endsWith(ext)) {
            logicalFileName = logicalFileName.slice(0, -ext.length);
            break;
          }
        }
      }

      const { path: resolvedPath, error } = resolvePath(currentPath, logicalFileName);
      if (error) return [error];

      const node = fileSystem[resolvedPath];
      if (node && node.type === 'dir') {
        return [`cat: ${rawFileName}: Is a directory`];
      }
      
      const rawText = fileContents[resolvedPath];

      if (rawText === undefined) {
        return [`cat: ${rawFileName}: No such file or directory`];
      }

      if (rawText === '') {
        return [`cat: ${rawFileName}: file is empty`];
      }

      const parsedContent = await marked.parse(rawText);
      const renderedText = parsedContent.replace(/<[^>]*>/g, '').trim();
      if (renderedText === '') {
        return [`cat: ${rawFileName}: file is empty`];
      }

      isReadingArticle = true;
      articleContent = parsedContent;
      await tick();
      if (articleViewRef) articleViewRef.focus();
      return [];
    },
    bh: () => { currentPath = '~'; return []; },
    cd: (args) => {
      const targetDir = args[0] || '~';
      if (!args[0]) { currentPath = '~'; return []; }
      const { path: newPath, error } = resolvePath(currentPath, targetDir);
      if (error) return [error];
      const node = fileSystem[newPath];
      if (node) {
        if (node.type === 'dir') {
          currentPath = newPath;
        } else {
          return [`cd: ${targetDir}: Not a directory`];
        }
      } else {
        return [`cd: ${targetDir}: No such file or directory`];
      }
      return [];
    },
    clear: () => { terminalHistory = []; return []; },
    exit: () => { window.close(); return ['Attempting to close tab...']; },
  };

  commands.ll = commands.ls;
  commands.cl = commands.clear;
  commands.io = commands.exit;

  async function processCommand() {
    const trimmedCommand = command.trim();
    if (trimmedCommand) {
      commandHistory = [...commandHistory, trimmedCommand];
      commandHistoryIndex = commandHistory.length;
    }
    const [cmd, ...args] = trimmedCommand.split(' ').filter(Boolean);
    let output = [];
    if (commands[cmd]) {
      output = await commands[cmd](args);
    } else if (command.trim() !== '') {
      output = [`command not found: ${cmd}`];
    }
    terminalHistory = [...terminalHistory, { command: trimmedCommand, path: currentPath, output }];
    command = '';
    await tick();
    if (containerRef) {
        containerRef.scrollTop = containerRef.scrollHeight;
    }
  }

  function focusInput() {
    if (inputRef) inputRef.focus();
  }

  function displayPath(path) {
    if (path === '~') return 'home/';
    if (path.startsWith('~/')) return `home/${path.substring(2)}/`;
    return path;
  }

  function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    if (direction === 'up') {
      commandHistoryIndex = Math.max(0, commandHistoryIndex - 1);
    } else {
      commandHistoryIndex = Math.min(commandHistory.length, commandHistoryIndex + 1);
    }
    if (commandHistoryIndex === commandHistory.length) {
      command = '';
    } else {
      command = commandHistory[commandHistoryIndex];
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') { e.preventDefault(); processCommand(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); navigateHistory('up'); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); navigateHistory('down'); return; }

    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = command.split(' ').filter(Boolean);
      const cmd = parts[0] || '';

      if (parts.length <= 1 && !command.endsWith(' ')) {
        const partialCmd = parts[0] || '';
        const hiddenAliases = ['ll', 'bh', 'io', 'cl'];
        const possibleCmds = Object.keys(commands).filter(c => c.startsWith(partialCmd) && !hiddenAliases.includes(c));
        if (possibleCmds.length === 1) {
          command = possibleCmds[0] + ' ';
        } else if (possibleCmds.length > 1) {
          terminalHistory = [...terminalHistory, { command: '', output: [possibleCmds.join('  ')], path: currentPath }];
        }
        return;
      }

      const isPathCmd = ['cd', 'ls', 'll', 'cat'].includes(cmd);
      if (!isPathCmd) return;

      const arg = parts.length > 1 ? parts[parts.length - 1] : '';

      // *** DEFINITIVE FIX: Special case for 'home' alias completion ***
      const homeVariations = ['h', 'ho', 'hom', 'home'];
      if (homeVariations.includes(arg.toLowerCase())) {
        parts[parts.length - 1] = 'home/';
        command = parts.join(' ');
        return;
      }

      const lastSlashIndex = arg.lastIndexOf('/');
      const dirPart = lastSlashIndex === -1 ? '.' : arg.substring(0, lastSlashIndex + 1);
      const partialName = lastSlashIndex === -1 ? arg : arg.substring(lastSlashIndex + 1);
      const { path: dirToSearch, error } = resolvePath(currentPath, dirPart);
      if (error) return;
      const dirNode = fileSystem[dirToSearch];
      if (!dirNode || dirNode.type !== 'dir') return;
      let possibleNames = Object.keys(dirNode.children).filter(name => name.startsWith(partialName));
      if (cmd === 'cd') {
        possibleNames = possibleNames.filter(name => dirNode.children[name].type === 'dir');
      }

      if (possibleNames.length === 1) {
        const fullName = possibleNames[0];
        const newArg = (dirPart === '.' ? '' : dirPart) + fullName;
        parts[parts.length - 1] = newArg;
        command = parts.join(' ');
        if (dirNode.children[fullName].type === 'dir') {
          command += '/';
        } else {
          command += ' ';
        }
      } else if (possibleNames.length > 1) {
        terminalHistory = [...terminalHistory, { command: '', output: [possibleNames.join('  ')], path: currentPath }];
      }
    }
  }

  function handleArticleViewKeydown(e) {
    if (e.key === 'q' || e.key === 'Escape') {
      isReadingArticle = false;
      tick().then(() => focusInput());
    }
  }

  async function fetchUserLocation() {
    try {
      const res = await fetch('https://ipinfo.io/json');
      if (!res.ok) throw new Error('Response not OK');
      const data = await res.json();
      if (data.city && data.country) { userLocation = `${data.city}, ${data.country}`; }
      else if (data.region && data.country) { userLocation = `${data.region}, ${data.country}`; }
      else if (data.country) { userLocation = data.country; }
      else { userLocation = 'unknown'; }
    } catch (error) {
      userLocation = 'unavailable';
    }
  }

  onMount(async () => {
    terminalHistory = [{ command: '', path: '~', output: [`Welcome to Nginr Terminal.`, `Type 'help' to see a list of available commands.`] }];
    await fetchUserLocation();
    clockInterval = setInterval(() => {
      currentTime = new Date();
    }, 1000);
    focusInput();
  });

  onDestroy(() => {
    clearInterval(clockInterval);
  });
</script>

<header class="terminal-header">
  <span>{userLocation}</span>
  <span>{currentTime.toLocaleTimeString()}</span>
</header>

<div
  class="terminal-container"
  on:click={focusInput}
  on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') focusInput(); }}
  role="button"
  tabindex="0"
>
  {#if isReadingArticle}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions, a11y-no-noninteractive-tabindex -->
    <div 
      class="article-view"
      bind:this={articleViewRef} 
      on:keydown={handleArticleViewKeydown}
      tabindex="0"
      role="article"
    >
      <div class="article-content">{@html articleContent}</div>
            <div class="article-footer">
        <span>Press 'q' or 'Escape' to return to the terminal.</span>
        <span class="signature">
          <span>© {new Date().getFullYear()}</span>
          <span class="separator">·</span>
          <span>Built with Svelte by</span>
          <a href="https://github.com/nginrsw" target="_blank" rel="noopener noreferrer" class="signature-link">
            <img src="/nginr.png" alt="nginr" class="avatar-img" />
            <span>nginr</span>
          </a>
        </span>
      </div>
    </div>
  {:else}
    <div class="terminal-content" bind:this={containerRef}>
      {#each terminalHistory as item}
        <div class="flex">
          <span class="text-terminal-text">{displayPath(item.path)}&gt;</span>
          <p class="flex-1 ml-2">{item.command}</p>
        </div>
        {#if item.output && item.output.length > 0}
          <div class="mb-2">
            {#each item.output as line}
              <p>{@html line.replace(/ /g, '&nbsp;')}</p>
            {/each}
          </div>
        {/if}
      {/each}

      <div class="flex">
        <span class="text-terminal-text">{displayPath(currentPath)}&gt;</span>
        <form on:submit|preventDefault={processCommand} class="flex-1 ml-2">
          <input
            type="text"
            bind:value={command}
            bind:this={inputRef}
            class="terminal-input"
            on:keydown={handleKeydown}
          />
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .article-footer {
    padding-top: 1rem;
    margin-top: 1rem;
    border-top: 1px solid #444;
    color: #aaa;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0; /* Prevent footer from shrinking */
  }

  .signature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .separator {
    color: #666;
  }

  .signature-link {
    display: inline-flex;
    align-items: center;
    color: #00c2ff;
    text-decoration: none;
    font-weight: bold;
  }

  .signature-link:hover {
    text-decoration: underline;
  }

  .avatar-img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
</style>
