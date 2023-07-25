const blessed = require('blessed');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const screen = blessed.screen({
  smartCSR: true,
});

const list = blessed.list({
  parent: screen,
  label: 'Wähle eine .bin Datei aus und bestätige mit Enter',
  border: 'line',
  keys: true,
  vi: true,
  style: {
    selected: {
      bg: 'blue',
    },
  },
  height: '80%',
  width: '80%',
  top: 'center',
  left: 'center',
});

let currentDir = process.cwd();

function updateList() {
  const items = fs.readdirSync(currentDir).map((filename) => {
    const fullPath = path.join(currentDir, filename);
    const stat = fs.statSync(fullPath);
    return stat.isDirectory() ? `[${filename}]` : filename;
  });
  list.setItems(items);
  list.setLabel(`Aktuelles Verzeichnis: ${currentDir}`);
  screen.render();
}

updateList();

screen.key(['q', 'C-c'], () => process.exit(0));

list.on('select', (item, selectedIndex) => {
  const selectedItem = list.getItem(selectedIndex).getContent();
  const fullPath = path.join(currentDir, selectedItem);

  if (selectedItem.startsWith('[') && selectedItem.endsWith(']')) {
    // Verzeichnis ausgewählt
    currentDir = fullPath.slice(1, -1);
    updateList();
  } else if (selectedItem.endsWith('.bin')) {
    // .bin-Datei ausgewählt
    const serverProcess = spawn('./server', ['-m', fullPath]);

    serverProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);0
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    serverProcess.on('close', (code) => {
      console.log(`serverProcess exited with code ${code}`);
    });

    // Hier könntest du das TUI für die Kommunikation mit dem Server anzeigen
  } else {
    const message = blessed.message({
      parent: screen,
      border: 'line',
      height: 'shrink',
      width: 'half',
      top: 'center',
      left: 'center',
      label: 'Hinweis',
      content: 'Bitte wähle eine .bin-Datei aus!',
      style: {
        border: {
          fg: 'red',
        },
      },
      keys: true,
      vi: true,
    });

    message.display(() => {
      list.focus();
    });
  }
});

screen.append(list);
list.focus();
screen.render();



// const blessed = require('blessed');
// const contrib = require('blessed-contrib');
// const fs = require('fs');
// const { spawn } = require('child_process');

// const screen = blessed.screen({
//   smartCSR: true,
// });

// const tree = contrib.filemanager({
//   label: 'Wähle eine .bin Datei aus und bestätige mit Enter',
//   border: 'line',
//   style: {
//     border: {
//       fg: 'blue',
//     },
//   },
//   keys: true,
//   vi: true,
//   parent: screen,
// });

// screen.key(['q', 'C-c'], () => process.exit(0)); // Beendet das Programm, wenn "q" gedrückt wird oder Strg-C

// // Event Handler für Enter-Taste (Auswahl)
// tree.on('file', (file) => {
//   if (fs.lstatSync(file).isFile() && file.endsWith('.bin')) {
//     // Starte den Server als Child-Prozess mit dem ausgewählten Dateipfad
//     const serverProcess = spawn('./server', ['-m', file]);

//     serverProcess.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//     });

//     serverProcess.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//     });

//     serverProcess.on('close', (code) => {
//       console.log(`serverProcess exited with code ${code}`);
//     });

//     // Hier könntest du das TUI für die Kommunikation mit dem Server anzeigen
//   } else {
//     // Fehlermeldung oder Hinweis, falls keine .bin-Datei ausgewählt wurde
//     const message = blessed.message({
//       parent: screen,
//       border: 'line',
//       height: 'shrink',
//       width: 'half',
//       top: 'center',
//       left: 'center',
//       label: 'Hinweis',
//       content: 'Bitte wähle eine .bin-Datei aus!',
//       style: {
//         border: {
//           fg: 'red',
//         },
//       },
//       keys: true,
//       vi: true,
//     });

//     message.display(() => {
//       tree.focus();
//     });
//   }
// });

// tree.refresh(); // Wird benötigt, um den Datei-Manager beim Start anzuzeigen
// screen.render();