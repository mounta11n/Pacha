const blessed = require('blessed');

const screen = blessed.screen({
  smartCSR: true,
});

const tabTitles = ['Tab 1', 'Tab 2', 'Tab 3'];
const tabContents = [
  blessed.box({ content: 'Inhalt von Tab 1' }),
  blessed.box({ content: 'Inhalt von Tab 2' }),
  blessed.box({ content: 'Inhalt von Tab 3' }),
];

const tabbar = blessed.listbar({
  top: 0,
  left: 0,
  right: 0,
  height: 1,
  items: tabTitles,
  keys: true,
  mouse: true,
  style: {
    selected: {
      bg: 'blue',
    },
  },
});

screen.append(tabbar);

tabContents.forEach((content, index) => {
  content.top = 1;
  content.left = 0;
  content.right = 0;
  content.bottom = 0;
  content.hidden = index !== 0;
  screen.append(content);
});

tabbar.items.forEach((item, index) => {
  item.on('click', () => {
    tabContents.forEach((content, i) => {
      content.hidden = i !== index;
    });
    screen.render();
  });
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

screen.render();