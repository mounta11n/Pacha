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
let tempNumberOfCpus = numberOfCpus % 2 === 0 ? numberOfCpus : numberOfCpus + 1;
const groupSize = tempNumberOfCpus / 4;

const groupPositions = [
  { y: 0, x: 0 },
  { y: 0, x: 6 },
  { y: 6, x: 0 },
  { y: 6, x: 6 },
];

function getGroupIndex(cpuIndex) {
  return Math.floor(cpuIndex / groupSize);
}

const groupLoadAverages = [0, 0, 0, 0];
const donuts = groupPositions.map(({ y, x }, i) => {
  return grid.set(y, x, 6, 6, blessedContrib.donut, {
    radius: 9,
    arcWidth: 2,
    remainColor: 'white',
    yPadding: 0,
    style: { border: false },
  });
});

let prevTotalUsage = Array(numberOfCpus).fill(0);
let prevTotalIdle = Array(numberOfCpus).fill(0);

const movingAverageLength = 10;
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

    cpuPercentages[i].shift();
    cpuPercentages[i].push(cpuPercent);

    const averageCpuPercent = cpuPercentages[i].reduce((sum, value) => sum + value) / movingAverageLength;

    const groupIndex = getGroupIndex(i);

    groupLoadAverages[groupIndex] += averageCpuPercent;

    prevTotalUsage[i] = totalUsage;
    prevTotalIdle[i] = totalIdle;
  });

  for (let i = 0; i < 4; i++) {
    const averageGroupLoad = (groupLoadAverages[i] / groupSize).toFixed(2);
    donuts[i].setData([{ percent: averageGroupLoad, label: ' ', color: 'green' }]);
    groupLoadAverages[i] = 0; // Reset for next update
  }

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