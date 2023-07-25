const blessed = require('blessed');
const fs = require('fs');

// Initialisierung des Bildschirms
const screen = blessed.screen({
  smartCSR: true,
  title: 'Dateiauswahl'
});

// Erstellung des Pop-ups zur Anzeige von Dateien
const fileDialog = blessed.filemanager({
  parent: screen,
  border: 'line',
  label: 'Dateiauswahl',
  height: 'half',
  width: 'half',
  top: 'center',
  left: 'center',
  vi: true,
  keys: true,
  mouse: true,
  style: {
    border: {
      fg: 'cyan'
    },
    header: {
      fg: 'white',
      bold: true
    },
    cell: {
      selected: {
        bg: 'blue'
      }
    }
  },
  cwd: process.env.HOME, // Startverzeichnis auf das Benutzerverzeichnis setzen
  keys: true,
  vi: true,
  scrollbar: {
    ch: ' ',
    inverse: true
  },
  mouse: true
});

fileDialog.refresh();

// Event-Handler für die Auswahl und Ausführung des Befehls
fileDialog.on('cancel', () => {
  screen.destroy();
});

fileDialog.on('submit', (file) => {
  const command = `./server -m ${file}`;
  // Hier kannst du den Befehl `command` ausführen oder an eine andere Funktion übergeben.
  // Zum Beispiel: executeCommand(command);
  screen.destroy();
});

// Event-Handler für die Tastatureingaben ESC, Q und STRG+C
screen.key(['escape', 'q', 'C-c'], () => {
  screen.destroy();
});

// Starten des Dateiauswahldialogs
fileDialog.focus();
screen.render();