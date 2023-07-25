const blessed = require('blessed');
const blessedContrib = require('blessed-contrib');
const os = require('os');

const screen = blessed.screen({
  smartCSR: true,
    fullUnicode: true,
    ignoreLocked: ['C-c'],
    mouse: true,
    dockBorders: true,
    resizeTimeout: 70,
  }
)

const grid = new blessedContrib.grid({ rows: 12, cols: 12, hideBorder: true, screen: screen });

const numberOfCpus = os.cpus().length;
const columnsPerRow = Math.ceil(numberOfCpus / 2);
const columnWidth = Math.max(Math.floor(12 / columnsPerRow), 1);
const rowsPerDonut = 6;
const donuts = Array(numberOfCpus)
  .fill(0)
  .map((_, i) => {
    // Berechne die X- und Y-Position für den Donut basierend auf dem Index i
    const xPos = (i % columnsPerRow) * columnWidth;
    const yPos = Math.floor(i / columnsPerRow) * rowsPerDonut;

    return grid.set(yPos, xPos, rowsPerDonut, columnWidth, blessedContrib.donut, {
      radius: 8,
      arcWidth: 1,
      remainColor: 'black',
      yPadding: 0,
      style: { border: false }, // TODO how to remove the border?
    });
  });

let prevTotalUsage = Array(numberOfCpus).fill(0);
let prevTotalIdle = Array(numberOfCpus).fill(0);

const movingAverageLength = 10; // Adjust this to change the number of data points to average
const cpuPercentages = Array(numberOfCpus)
  .fill(0)
  .map(() => Array(movingAverageLength).fill(0));

function updateCpuUsage() {
  const cpuUsage = os.cpus();

  cpuUsage.forEach((core, i) => {
    const totalUsage = core.times.user + core.times.nice + core.times.sys;
    const totalIdle = core.times.idle;

    const diffUsage = totalUsage - prevTotalUsage[i];
    const diffTotal = (totalUsage + totalIdle) - (prevTotalUsage[i] + prevTotalIdle[i]);

    const cpuPercent = (diffUsage / diffTotal) * 100;

    cpuPercentages[i].shift(); // Remove the oldest data point
    cpuPercentages[i].push(cpuPercent); // Add the newest data point

    const averageCpuPercent = cpuPercentages[i].reduce((sum, value) => sum + value) / movingAverageLength;
    
    // donuts[i].setData([{ percent: averageCpuPercent.toFixed(2), label: `CPU ${i + 1}`, color: 'green' }]);
    donuts[i].setData([{ percent: averageCpuPercent.toFixed(2), label: ' ', color: 'green' }]);

    prevTotalUsage[i] = totalUsage;
    prevTotalIdle[i] = totalIdle;
  });

  screen.render();
}

setInterval(updateCpuUsage, 70);

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

screen.render();
screen.key(['C-c'], () => {
  return process.exit(0);
});
screen.on('element keypress', () => {
  screen.render();
});
