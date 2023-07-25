const blessed = require('blessed');
const contrib = require('blessed-contrib');
const fs = require('fs');
const path = require('path');

const screen = blessed.screen();
const tree = contrib.tree({style: {text: 'cyan'}});

function directoryTree(basePath, filePath = basePath) {
    const stats = fs.statSync(filePath);
    const isDirectory = stats.isDirectory();
    const item = {path: filePath};
    
    if (isDirectory) {
      item.name = path.basename(filePath) || basePath;
      item.extended = true;
      item.children = fs.readdirSync(filePath)
                        .map(childPath => directoryTree(basePath, path.join(filePath, childPath)))
                        .filter(child => child !== null);
    } else if (path.extname(filePath) === '.js') {
      item.name = path.basename(filePath);
    } else {
      return null;
    }
  
    return item;
  }

  const treeData = directoryTree('.');

  tree.setData({extended: true, children: treeData.children});
screen.append(tree);

tree.focus();
tree.on('select', function (node) {
  console.log('Selected: ' + node.path);
});

screen.on('keypress', function (ch, key) {
  if (key.name === 'q' || (key.name === 'c' && key.ctrl)) {
    process.exit(0);
  }
});

screen.render();