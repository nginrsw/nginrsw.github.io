<script>
  import { onMount, onDestroy, tick } from 'svelte';

  let history = [];
  let command = '';
  let inputRef;
  let containerRef;
  let currentPath = '~';
  let commandHistory = [];
  let commandHistoryIndex = 0;
  let currentTime = new Date();
  let location = 'locating...';
  let clockInterval;
  let startTime = new Date();


  const fileSystem = {
    '~': ['about.txt', 'projects', 'skills'],
    '~/projects': ['portfolio-v1.js', 'this-website.svelte', 'upcoming-project.md'],
    '~/skills': ['javascript', 'svelte', 'tailwind', 'nodejs'],
  };

  const commands = {
    help: () => [
      'Available commands:',
      '  help         ——— Shows this help message.',
      '  about        ——— Shows a brief bio.',
      '  whoami       ——— Displays the current user.',
      '  date         ——— Displays the current date and time.',
      '  neofetch     ——— Displays system information.',
      '  ls           ——— Lists files and directories.',
      '  pwd          ——— Shows the current directory path.',
      '  cat <file>   ——— Displays the content of a file.',
      '  cd <dir>     ——— Changes the current directory.',
      '  clear        ——— Clears the terminal screen.',
      '  exit         ——— [fake] Closes the terminal session.',
      '',
      'Tips:',
      '  - Use Tab for autocompletion.',
      '  - Use Arrow Up/Down to navigate command history.'
    ],
    about: () => ['My name is Nginr.', 'I am a passionate software engineer.', 'This is a dummy bio for now.'],
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

      return [
        '    ▘         ',
        '▛▌▛▌▌▛▌▛▘▛▘▌▌▌',
        '▌▌▙▌▌▌▌▌ ▄▌▚▚▘',
        '  ▄▌          ',
        '',
        'guest@nginr-portfolio',
        '---------------------',
        'OS: Nginr Web OS',
        'Host: Portfolio v2.0',
        'Kernel: 6.9.0-svelte',
        `Uptime: ${uptimeString}`,
        'Shell: port-sh',
        'Font: 0xProto'
      ];
    },
    ls: () => fileSystem[currentPath] || [],
    pwd: () => [displayPath(currentPath)],
    cat: (args) => {
      const fileName = args[0];
      if (!fileName) return ['cat: missing operand'];

      const fileContents = {
        'about.txt': ['My name is Nginr.', 'I am a passionate software engineer.', 'This is a dummy bio for now.'],
        'portfolio-v1.js': ['// This was my first portfolio, written in vanilla JS.', 'console.log("Hello, World!");'],
        'this-website.svelte': ['<!-- You are looking at it! -->', '<h1>This website was built with Svelte.</h1>'],
        'upcoming-project.md': ['# Upcoming Secret Project', 'Stay tuned for something exciting...']
      };

      const currentFiles = fileSystem[currentPath] || [];
      if (currentFiles.includes(fileName) && fileContents[fileName]) {
        return fileContents[fileName];
      }
      
      return [`cat: ${fileName}: No such file or directory`];
    },
    cd: (args) => {
      const newPath = args[0];
      if (!newPath || newPath === '..' || newPath === '~') {
        currentPath = '~';
      } else if (fileSystem[`${currentPath}/${newPath}`]) {
        currentPath = `${currentPath}/${newPath}`;
      } else {
        return [`cd: no such file or directory: ${newPath}`];
      }
      return [];
    },
    clear: () => {
      history = [];
      return [];
    },
    exit: () => ['Thanks for visiting!, but you cannot exit from here, just close the tab.'],
    echo: (args) => [args.join(' ')],
  };

  commands.ll = commands.ls;
  commands.cl = commands.clear;

  async function processCommand() {
    const trimmedCommand = command.trim();
    if (trimmedCommand) {
      commandHistory = [...commandHistory, trimmedCommand];
      commandHistoryIndex = commandHistory.length;
    }

    const [cmd, ...args] = trimmedCommand.split(' ').filter(Boolean);
    let output = [];

    if (commands[cmd]) {
      output = commands[cmd](args);
    } else if (command.trim() !== '') {
      output = [`command not found: ${cmd}`];
    }

    history = [...history, { command, path: currentPath, output }];
    command = '';
    await tick();
    containerRef.scrollTop = containerRef.scrollHeight;
  }

  function focusInput() {
    inputRef.focus();
  }

  function displayPath(path) {
    if (path === '~') {
      return 'home/';
    }
    if (path.startsWith('~/')) {
      return `home/${path.substring(2)}`;
    }
    return path;
  }

  function handleKeydown(event) {
    // Command History Navigation
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length > 0) {
        commandHistoryIndex = Math.max(0, commandHistoryIndex - 1);
        command = commandHistory[commandHistoryIndex] || '';
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (commandHistory.length > 0) {
        commandHistoryIndex = Math.min(commandHistory.length, commandHistoryIndex + 1);
        command = commandHistory[commandHistoryIndex] || '';
        if (commandHistoryIndex === commandHistory.length) {
          command = '';
        }
      }
    } 
    // Autocomplete
    else if (event.key === 'Tab') {
      event.preventDefault();
      const parts = command.trim().split(' ');
      const cmd = parts[0];

      // Case 1: Autocomplete command itself
      if (parts.length === 1) {
        const availableCommands = Object.keys(commands);
        const matchingCommands = availableCommands.filter(c => c.startsWith(cmd));
        if (matchingCommands.length === 1) {
          command = matchingCommands[0];
        }
      } 
      // Case 2: Autocomplete 'cd' arguments
      else if (cmd === 'cd' && parts.length === 2) {
        const arg = parts[1];
        const currentContent = fileSystem[currentPath] || [];
        const directories = currentContent.filter(item => fileSystem[`${currentPath}/${item}`]);
        const matchingDirs = directories.filter(dir => dir.startsWith(arg));
        if (matchingDirs.length === 1) {
          command = `cd ${matchingDirs[0]}`;
        }
      } 
      // Case 3: Autocomplete 'cat' arguments
      else if (cmd === 'cat' && parts.length === 2) {
        const arg = parts[1];
        const currentContent = fileSystem[currentPath] || [];
        const files = currentContent.filter(item => !fileSystem[`${currentPath}/${item}`]);
        const matchingFiles = files.filter(file => file.startsWith(arg));
        if (matchingFiles.length === 1) {
          command = `cat ${matchingFiles[0]}`;
        }
      }
    }
  }

  onMount(async () => {
    history = [{ command: '', path: '~', output: [`Welcome to Nginr's Portfolio.`, `Type 'help' to see a list of available commands.`] }];
    focusInput();

    // Live Clock
    clockInterval = setInterval(() => {
      currentTime = new Date();
    }, 1000);

    // Fetch Location
    try {
      const res = await fetch('https://ipinfo.io/json');
      const data = await res.json();
      if (data.city && data.country) {
        location = `${data.city}, ${data.country}`;
      } else if (data.region && data.country) {
        location = `${data.region}, ${data.country}`;
      } else if (data.country) {
        location = data.country;
      } else {
        location = 'unknown';
      }
    } catch (error) {
      location = 'unavailable';
    }
  });

  onDestroy(() => {
    clearInterval(clockInterval);
  });
</script>

<header class="terminal-header">
  <span>{location}</span>
  <span>{currentTime.toLocaleTimeString()}</span>
</header>

<div
  class="terminal-content"
  on:click={focusInput}
  on:keydown={(e) => e.key === 'Enter' && focusInput()}
  bind:this={containerRef}
  role="button"
  tabindex="0"
>
  {#each history as item}
    <div class="flex">
      <span class="text-terminal-text">{displayPath(item.path)}&gt;</span>
      <p class="flex-1 ml-2">{item.command}</p>
    </div>
    {#if item.output && item.output.length > 0}
      <div class="mb-2">
        {#each item.output as line}
          <p>{line}</p>
        {/each}
      </div>
    {/if}
  {/each}

  <div class="flex">
    <span class="text-terminal-text">{displayPath(currentPath)}></span>
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
