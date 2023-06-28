const blessed = require('blessed');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const osUtils = require('os-utils');

const fsPromises = fs.promises;

const args = process.argv.slice(2);

const screen = blessed.screen({
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
  ignoreLocked: ['C-c'],
 }
)
//
// --------------------------------------------





// --------------------------------------------
// for some reason inputBox and multiNotes have to been initialized already here, otherwise the app will crash
//
const inputBox = blessed.textbox({
  top: 0,
  left: 3,
  height: '100%-2',
  width: '85%-4',
  done: () => {},
  keys: true,
  mouse: true,
  // align: 'center',
  // valign: 'middle',
  inputOnFocus: true,
  style: {
    bg: '#d3d7cf',
    fg: '#555753',
    bold: false,
    hover: {
      bg: '#f5f5f5',
      fg: '#555753',
      bold: true,
    },
    focus: {
      bg: '#f5f5f5',
      fg: '#555753',
      bold: true,
    },
    selected: {
      bg: '#f5f5f5',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

inputBox.on('submit', () => {});
//
// --------------------------------------------





// --------------------------------------------
// custom widget for multi-line text
//
function MultilineTextBox(options) {
  blessed.Textarea.call(this, options);
}

MultilineTextBox.prototype = Object.create(blessed.Textarea.prototype);
MultilineTextBox.prototype.constructor = MultilineTextBox;

// override the `type` method of the textarea widget,
// to allow input from multiple lines
MultilineTextBox.prototype.type = 'multiline-textbox';

// create an instance of the custom widget
const multiNotes = new MultilineTextBox({
  done: () => {},
  top: 1,
  left: 0,
  width: '100%-4',
  height: '100%-4',
  label: 'Notes',
  tags: true,
  keys: true,
  mouse: true,
  scrollable: true,
  inputOnFocus: true,
  border: {
    type: 'line'
  },
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    label: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    hover: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
    },
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
    },
    // selected: {
    //   bg: '#555753',
    //   fg: '#8ae234',
    //   bold: true,
    // },
  },
 }
)

inputBox.on('submit', () => {});
// multiNotesSaveLabel.on('click', () => {
//   saveMultiNotes();
// });
multiNotes.on('submit', () => {});
//
// --------------------------------------------





// --------------------------------------------
//
const frame = blessed.box({
  top: 3,
  bottom: 5,
  left: 12,
  right: 15,
  // width: '91%',
  // height: '91%',
  // border: {
  //   type: 'line',
  // },
 }
)

const topBar = blessed.box({
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: 1,
  // align: 'center',
  // valign: 'middle',
  hoverText: '\n cpu usage is indicated by color \n\nlow -> grey \n16% -> dark-green \n51% -> bright-green \n73% -> cyan \n87% -> magenta\n96% -> red \n',
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    border: {
      fg: '#d3d7cf'
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)

const sidebarRight = blessed.box({
  top: 1,
  right: 0,
  bottom: 0,
  // left: '73%',
  width: 48,
  height: '100%-1',
  style: {
    bg: '#555753',
    fg: '#4e9a06',
  },
 }
)

const midEtLeftFrame = blessed.box({
  top: 1,
  bottom: 0,
  right: 48,
  // left: 'center',
  width: '100%-48',
  height: '100%-1',
  // border: {
  //   type: 'line',
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
  },
})

const midFrame = blessed.box({
  top: 0,
  bottom: 0,
  right: 0,
  // left: 'center',
  width: '63%',
  height: '100%',
  style: {
    bg: '#555753',
    fg: '#555753',},
  // border: {
  //   type: 'line',//debugging
  // }
 }
)

const sidebarLeft = blessed.box({
  // left: '5%',
  top: 0,
  bottom: 0,
  left: 0,
  width: '38%',
  keys: true,
  mouse: true,
  scrollable: true,
  alwaysScroll: true,
  // height: '95%',
  style: {
    bg: '#555753',
    fg: '#8ae234',
  },
  // border: {
  //   type: 'line',//debugging
  // },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const topBarRightTooltip = blessed.text({
  top: 0,
  right: 0,
  width: '100%',
  height: 2,
  // left: '55%',
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n cpu usage is indicated by color \n\nlow -> grey \n16% -> dark-green \n51% -> bright-green \n73% -> cyan \n87% -> magenta\n96% -> red \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const topBarMidTooltip = blessed.text({
  top: 0,
  left: 0,
  width: '100%',
  height: 2,
  // left: '55%',
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n cpu usage is indicated by color \n\nlow -> grey \n16% -> dark-green \n51% -> bright-green \n73% -> cyan \n87% -> magenta\n96% -> red \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
    },
  },
 }
)

const topBarLeftTooltip = blessed.text({
  top: 0,
  left: 0,
  width: '100%',
  height: 2,
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n cpu usage is indicated by color \n\nlow -> grey \n16% -> dark-green \n51% -> bright-green \n73% -> cyan \n87% -> magenta\n96% -> red \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const topBarLabel = blessed.box({
  top: 2,
  left: 2,
  width: '33%',
  height: 1,
  // align: 'center',
  // valign: 'bottom',
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    bold: true,
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
    // border: {
    //   bg: 'red',
    //   fg: '#d3d7cf'
    // },
  // border: {
  //   type: 'line'
  // },
    // selected: {
    //   bg: '#555753',
    //   fg: '#8ae234',
    //   bold: true,
    // },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const fileEtTipFrame = blessed.box({
  top: 4,
  left: 2,
  right: 0,
  // width: '100%',
  height: '38%-2',
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    border: {
      bg: '#555753',
      fg: 'red',
    },
  },
  // border: {
  //   type: 'line'//debugging
  // },
})

const fileListRightTooltip = blessed.text({
  top: 1,
  // left: '95%',
  right: 0,
  width: 6,
  height: '100%-3',
  // left: '55%',
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n models found in your folder \n',
  // border: {
  //   type: 'line'//debugging
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const fileListBottomTooltip = blessed.text({
  // top: 12,
  bottom: 0,
  left: 0,
  // right: 5,
  // right: '25%',
  width: '100%-2',
  height: 4,
  content: '',
  hoverText: '\n models found in your folder \n',
  // transparent: true,
  // invisible: true,
  // border: {
  //   type: 'line'//debugging
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const fileList = blessed.list({
  top: 1,
  left: 0,
  width: '100%-6',
  height: '100%-4',
  label: 'Model',
  keys: true,
  mouse: true,
  border: {
    type: 'line'
  },
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    label: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const dropEtAreaFrame = blessed.box({
  // top: 20,
  bottom: 2,
  // valign: 'middle',
  left: 2,
  // right: 0,
  // width: '100%',
  height: '62%-2',
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    border: {
      bg: '#555753',
      fg: 'blue',
    },
  },
  // border: {
  //   type: 'line'//debugging
  // },
})

const dropEtTipFrame = blessed.box({
  top: 0,
  left: 0,
  width: '100%-2',
  height: '50%',
  keys: true,
  mouse: true,
  // border: {
  //   type: 'line'
  // },
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)

const textAreaEtTipFrame = blessed.box({
  bottom: 0,
  left: 0,
  width: '100%-2',
  height: '50%',
  keys: true,
  mouse: true,
  // border: {
  //   type: 'line'//debugging
  // },
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const dropDownOptions = [
  'Custom/None',
  'Instruction',
  'Airoboros',
  'Alpaca',
  'based',
  'CAMEL Combined',
  'Chronos',
  'Gorilla',
  'GPT4 x Alpaca',
  'GPT4 x Vicuna',
  'Guanaco',
  'Guanaco QLoRA',
  'H2O\'s GPT-GM-OASST1-Falcon 40B v2',
  'Hippogriff',
  'Karen The Editor',
  'Lazarus 30B',
  'Manticore',
  'Minotaur',
  'MPT 30B',
  'Nous Hermes',
  'OpenAssistant LLaMA',
  'Orca Mini',
  'Samantha',
  'Stable Vicuna',
  'Starchat',
  'Tulu',
  'Vicuna V0',
  'Vicuna V1.1 & V1.3',
  'Vigogne Chat',
  'Vigogne Instruct',
  'WizardLM 7B',
  'WizardLM 13B & 30B V1.0',
  'WizardLM 33B V1.0 Uncensored',
  'WizardVicunaLM',
];

const dropDown = blessed.list({
  top: 1,
  left: 0,
  width: '100%-4',
  height: '100%-4',
  label: 'Prompt Style',
  keys: true,
  mouse: true,
  items: dropDownOptions,
  selected: 'Instruction',
  border: {
    type: 'line'
  },
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    label: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
      selected: {
        bg: '#555753',
        fg: 'red',
        bold: true,
      },
    },
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)

// dropDown.focus();// want to set focus on on index 1 (Instruction), but havent figured out yet
// screen.render();

const dropDownRightTooltip = blessed.text({
  top: 1,
  right: 0,
  width: 6,
  height: '100%-4',
  // left: '55%',
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n choose the right prompt style template \n',
  // border: {
  //   type: 'line'
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const dropDownBottomTooltip = blessed.text({
  bottom: 0,
  left: 0,
  width: '100%',
  height: 4,
  // left: '55%',
  // align: 'center',
  // valign: 'bottom',
  content: '',
  hoverText: '\n choose the right prompt style template \n',
  // border: {
  //   type: 'line'
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const textAreaRightTooltip = blessed.text({
  top: 1,
  right: 0,
  width: 6,
  height: '100%-2',
  // left: '55%',
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n make your own notes and save them. \ntimestamp and the current belonging parameters will be saved as well \n',
  // border: {
  //   type: 'line'
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const textAreaBottomTooltip = blessed.text({
  bottom: 0,
  left: 0,
  width: '100%-9',
  height: 4,
  // left: '55%',
  // align: 'center',
  // valign: 'bottom',
  content: '',
  hoverText: '\n make your own notes and save them. \ntimestamp and the current belonging parameters will be saved as well \n',
  // border: {
  //   type: 'line'//debugging
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const textAreaBottom2Tooltip = blessed.text({
  bottom: 0,
  left: 0,
  width: '100%',
  height: 2,
  // left: '55%',
  // align: 'center',
  // valign: 'bottom',
  content: '',
  hoverText: '\n make your own notes and save them. \ntimestamp and the current belonging parameters will be saved as well \n',
  // border: {
  //   type: 'line'//debugging
  // },
  style: {
    bg: '#555753',
    fg: '#555753',
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const multiNotesSaveLabel = blessed.box({
  done: () => {},
  bottom: 2,
  right: 5,
  width: 4,
  height: 1,
  content: 'Save',
  // align: 'center',
  // valign: 'middle',
  // border: {
  //   type: 'line'
  // },
  style: {
    bg: '#555753',
    fg: '#4e9a06',
    bold: true,
    border: {
      bg: '#555753',
      fg: 'red',
    },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
    focus: {
      border: {
        fg: 'blue',
      }
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)

multiNotesSaveLabel.on('submit', () => {});
inputBox.on('submit', () => {});
// multiNotesSaveLabel.on('click', () => {
//   saveMultiNotes();
// });
//
// --------------------------------------------





// --------------------------------------------
//
const radioButtonTooltip = blessed.text({
  bottom: 0,
  left: 0,
  width: 23,
  height: 6,
  // left: '55%',
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n use mirostat sampling\n\ntop-k; nucleus (top-p); tail free and locally typical samplers are ignored if used\n\n(default = 0 = disabled; 1 = mirostat; 2 = mirostat 2.0) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const radioButtonBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 3,
  content: '',
  // border: 'line',
  // content: 'makes sense with border',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const radioSet = blessed.radioset({
  top: 0,
  left: 4,
  width: 15,
  height: 3,
  keys: true,
  mouse: true,
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
  },
 }
)

const radioButtonOptions = [
  { name: 'Mirostat 0', top: 0, left: 0 },
  { name: '1', top: 2, left: 0 },
  { name: '2', top: 2, left: 9 },
];

radioButtonOptions.forEach((option) => {
  const radioButton = blessed.radiobutton({
    top: option.top,
    left: option.left,
    mouse: true,
    keys: true,
    content: option.name,
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
  });
  radioSet.append(radioButton);

// set default radio button to 0
radioSet.children[radioButtonOptions.length - 3].check();
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const sendButton = blessed.button({
  done: () => {},
  bottom: 2,
  right: 3,
  // left: 0,
  height: '100%-2',
  width: '16%-3',
  keys: true,
  mouse: true,
  content: 'Send',
  align: 'center',
  valign: 'middle',
  style: {
    fg: '#f5f5f5',
    bg: '#4e9a06',
    // border: {
    //   fg: '#f5f5f5',
    // },
    hover: {
      bg: '#8ae234',
      fg: '#f5f5f5',
      bold: true,
    },
  },
 }
)

sendButton.on('submit', () => {});
inputBox.on('submit', () => {});

const inputEtSendFrame = blessed.box({
  bottom: 0,
  right: 0,
  height: 5,
  width: '100%',
  style: {
    fg: '#555753',
    bg: '#555753',
    border: {
      //  bg: '#555753',
      fg: 'yellow',
    }
  },
  // border: {
  //   type:'line',
  // },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const lrMiroTooltip = blessed.text({
  bottom: 4,
  left: 21,
  width: 21,
  height: 3,
  content: '',
  hoverText: '\n mirostat learning rate, parameter eta (0 - 1; default = 0.1)\nhigher values learn from shorter text sections (good for instructions, for example). low values response better to longer texts (like creative and story writing)',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const lrMiroBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const lrMiroInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 1,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

lrMiroInput.on('submit', () => {});
inputBox.on('submit', () => {});

const lrMiroLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'eta',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)

// --------------------------------------------





// --------------------------------------------
//
const entMiroTooltip = blessed.text({
  bottom: 2,
  left: 21,
  width: 21,
  height: 3,
  content: '',
  hoverText: '\n mirostat target entropy, parameter tau (default = 5.0)\nit tries to correlate with perplexity. lower values aim for lower perplexity \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const entMiroBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const entMiroInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 1,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

entMiroInput.on('submit', () => {});
inputBox.on('submit', () => {});

const entMiroLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'tau',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const miroEtFrame = blessed.box({
  top: 2,
  left: 3,
  width: '100%-3',
  height: '32%-8',
  // border: 'line',
  style: {
    // bg: '#f0f',//debugging
    bg: '#555753',
    fg: '#555753',
  },
 }
)

const hyperParamsFrame = blessed.box({
  bottom: 8,
  left: 3,
  width: '100%-7',
  height: '53%',
  // border: 'line',
  style: {
    // bg: '#f00',//debugging
    bg: '#555753',
    fg: '#555753',
  },
 }
)

const checkboxesFrame = blessed.box({
  bottom: 1,
  left: 1,
  width: '100%-1',
  height: 6,
  // border: 'line',
  style: {
    // bg: '#0ff',//debugging
    bg: '#555753',
    fg: '#555753',
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const temperatureTooltip = blessed.text({
  bottom: 4,
  left: 0,
  width: 21,
  height: 4,
  content: '',
  // border: 'line',
  // content: 'makes sense with border',
  hoverText: '\n temperature (default = 0.8) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const temperatureBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  // border: 'line',
  // content: 'makes sense with border',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const temperatureInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
    bg: '#4e9a06',
    fg: '#f5f5f5',
    bold: true,
    focus: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
    },
    hover: {
      bg: '#8ae234',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

temperatureInput.on('submit', () => {});
inputBox.on('submit', () => {});

const temperatureLabel = blessed.text({
  top: 0,
  left: 3,
  content: 'Temperature',
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
    },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const maxTokensTooltip = blessed.text({
  bottom: 4,
  left: 21,
  width: 21,
  height: 4,
  // left: '55%',
  // align: 'center',
  // valign: 'middle',
  content: '',
  hoverText: '\n size of the prompt context (default = 512) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const maxTokensBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  // border: 'line',
  // content: 'makes sense with border',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const maxTokensInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'c_ctx',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
      },
    },
  }
)

maxTokensInput.on('submit', () => {});
inputBox.on('submit', () => {});

const maxTokensLabel = blessed.text({
      top: 0,
      left: 3,
      content: 'Max Tokens',
      style: {
        bg: '#555753',
        fg: '#f5f5f5',
        focus: {
          bg: '#555753',
          fg: '#f5f5f5',
        },
        hover: {
          bg: '#555753',
          fg: '#8ae234',
          bold: true,
        },
    },
  }
)
//
// --------------------------------------------





// --------------------------------------------
//
const topPTooltip = blessed.text({
  bottom: 8,
  left: 0,
  width: 21,
  height: 4,
  content: '',
  hoverText: '\n top-p sampling (default = 0.9, disabled = 1.0 \n)',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})
//
const topPBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const topPInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: '',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

topPInput.on('submit', () => {});
inputBox.on('submit', () => {});

const topPLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'Top-P',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)

// --------------------------------------------





// --------------------------------------------
//
const nPredictTooltip = blessed.text({
  bottom: 8,
  left: 21,
  width: 21,
  height: 4,
  content: '',
  hoverText: '\n what is the maximum number of text tokens the language model should generate?\n\nEnter -1 for infinity (default = 58) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const nPredictBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const nPredictInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

nPredictInput.on('submit', () => {});
inputBox.on('submit', () => {});

const nPredictLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'N-Predict',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)

// --------------------------------------------





// --------------------------------------------
//
const topKTooltip = blessed.text({
  bottom: 12,
  left: '0',
  width: 21,
  height: 4,
  content: '',
  hoverText: '\n top-k sampling (default = 40; disabled = 0) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const topKBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const topKInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

topKInput.on('submit', () => {});
inputBox.on('submit', () => {});

const topKLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'Top-K',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const repeatLastTooltip = blessed.text({
  bottom: 12,
  left: 21,
  width: 21,
  height: 4,
  content: '',
  hoverText: '\n just in case: IF you want to be sadistic: how many of the last tokens would you like to penalize? (default = 64; -1 means that the whole context size should be considered) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const repeatLastBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const repeatLastInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

repeatLastInput.on('submit', () => {});
inputBox.on('submit', () => {});

const repeatLastLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'Repeat Last',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const LTSTooltip = blessed.text({
  bottom: 16,
  left: '0',
  width: 21,
  height: 4,
  content: '',
  hoverText: '\n locally typical sampling, parameter p (default = 1.0 = disabled; recommended 0.5 or 0.95) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const LTSBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
})

const LTSInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

LTSInput.on('submit', () => {});
inputBox.on('submit', () => {});

const LTSLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'LTS',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const presencePenaltyTooltip = blessed.text({
  bottom: 16,
  left: 21,
  width: 21,
  height: 4,
  content: '',
  hoverText: '\n repeat alpha presence penalty (default = 0.0 = disabled) \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const presencePenaltyBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const presencePenaltyInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 13,
  height: 2,
  // label: 'text inside field',
  keys: true,
  mouse: true,
  content: 'test',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      bold: true,
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
        bold: true,
      },
      hover: {
        bg: '#8ae234',
        fg: '#555753',
        bold: true,
      },
    },
 }
)

presencePenaltyInput.on('submit', () => {});
inputBox.on('submit', () => {});

const presencePenaltyLabel = blessed.text({
    top: 0,
    left: 3,
    content: 'Pres-Penalty',
    style: {
      bg: '#555753',
      fg: '#f5f5f5',
      focus: {
        bg: '#555753',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const advancedTooltip = blessed.text({
  bottom: 0,
  left: 0,
  width: 42,
  height: 4,
  // left: '55%',
  // align: 'center',
  valign: 'middle',
  content: '?',
  hoverText: '\n here you can set your own flags manually like: prompt cache; prompt file; mlock; gpu settings; lora and more. see ./main --help for more info \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const advancedBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 4,
  height: 2,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const advancedInput = blessed.textbox({
  done: () => {},
  top: 1,
  left: 3,
  width: 34,
  height: 2,
  keys: true,
  mouse: true,
  // align: 'center',
  // valign: 'middle',
  inputOnFocus: true,
  style: {
      bg: '#4e9a06',
      fg: '#f5f5f5',
      focus: {
        bg: '#4e9a06',
        fg: '#f5f5f5',
      },
      hover: {
        bg: '#8ae234',
        fg: '#f5f5f5',
      },
    },
  }
)

advancedInput.on('submit', () => {});
inputBox.on('submit', () => {});

const advancedLabel = blessed.text({
  top: 0,
  left: 3,
  content: 'Advanced',
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
    },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const historyTooltip = blessed.text({
  bottom: 2,
  left: 0,
  width: 18,
  height: 2,
  // left: '55%',
  // align: 'center',
  valign: 'middle',
  content: '?',
  hoverText: '\n your dialogs will be concatenated and presented to the model as a chat history \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const historyBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const historyCheckbox = blessed.checkbox({
  top: 0,
  left: 1,
  width: 11,
  height: 1,
  mouse: true,
  keys: true,
  content: 'History',
  hoverText: '',
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
    },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const storeTextTooltip = blessed.text({
  bottom: 0,
  left: 0,
  width: 18,
  height: 2,
  // left: '55%',
  // align: 'center',
  valign: 'middle',
  content: '?',
  hoverText: '\n store a local markdown file of your conversation \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const storeTextBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const storeTextCheckbox = blessed.checkbox({
  top: 0,
  left: 1,
  width: 11,
  height: 1,
  mouse: true,
  keys: true,
  content: 'Store',
  hoverText: '',
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
    },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const semanticMemoryTooltip = blessed.text({
  bottom: 0,
  left: 30,
  width: 17,
  height: 2,
  // left: '55%',
  // align: 'center',
  valign: 'middle',
  content: '?',
  hoverText: ' infinite memory (bert.ggml vector embedding & semantic search)\nresults are injected into prompt',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const semanticMemoryBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const semanticMemoryCheckbox = blessed.checkbox({
  top: 0,
  left: 1,
  width: 10,
  height: 1,
  mouse: true,
  keys: true,
  content: 'Memory',
  hoverText: '',
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
    },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const appendMemoryTooltip = blessed.text({
  bottom: 0,
  left: 18,
  width: 12,
  height: 2,
  // left: '55%',
  // align: 'center',
  valign: 'middle',
  content: '',
  hoverText: '\n append current conversation to your semantic memory file in real-time \n',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const appendMemoryBlockTooltip = blessed.text({
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  content: '',
  style: {
    bg: '#555753',
    fg: '#555753',
    focus: {
      bg: '#555753',
      fg: '#555753',
    },
    hover: {
      bg: '#555753',
      fg: '#555753',
      bold: true,
    },
  },
 }
)

const appendMemoryCheckbox = blessed.checkbox({
  top: 0,
  left: 1,
  width: 7,
  height: 1,
  mouse: true,
  keys: true,
  content: '->',
  hoverText: '',
  style: {
    bg: '#555753',
    fg: '#f5f5f5',
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
    },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
const outputBox = blessed.box({
  top: 2,
  // bottom: '16%',
  left: 3,
  width: '100%-6',
  height: '100%-8',
  keys: true,
  mouse: true,
  scrollable: true,
  alwaysScroll: true,
  style: {
    bg: '#d3d7cf',
    fg: '#000',
  },
  scrollbar: {
    ch: ' ',
    track: {
      bg: '#8ae234',
      fg: '#4e9a06',
    },
    style: {
      inverse: false,
      // bg: 'red',
      // fg: '#f5f5f5',
    },
  },
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
screen.append(frame);

  frame.append(topBar);
  frame.append(sidebarRight);
  frame.append(midEtLeftFrame);

    midEtLeftFrame.append(midFrame);
    midEtLeftFrame.append(sidebarLeft);

    midFrame.append(topBarMidTooltip);

    midFrame.append(inputEtSendFrame);
      inputEtSendFrame.append(sendButton);
      inputEtSendFrame.append(inputBox);
    
    midFrame.append(outputBox);

    sidebarLeft.append(topBarLeftTooltip);
    sidebarLeft.append(topBarLabel);

    sidebarLeft.append(fileEtTipFrame);
      fileEtTipFrame.append(fileListRightTooltip);
      fileEtTipFrame.append(fileListBottomTooltip);
      fileEtTipFrame.append(fileList);

    sidebarLeft.append(dropEtAreaFrame);
      dropEtAreaFrame.append(dropEtTipFrame);
        dropEtTipFrame.append(dropDownRightTooltip);
        dropEtTipFrame.append(dropDownBottomTooltip);
        dropEtTipFrame.append(dropDown);

      dropEtAreaFrame.append(textAreaEtTipFrame);
        textAreaEtTipFrame.append(textAreaRightTooltip);
        textAreaEtTipFrame.append(textAreaBottomTooltip);
        textAreaEtTipFrame.append(textAreaBottom2Tooltip);
        textAreaEtTipFrame.append(multiNotes);
        textAreaEtTipFrame.append(multiNotesSaveLabel);

    sidebarRight.append(topBarRightTooltip);
    sidebarRight.append(miroEtFrame);
    sidebarRight.append(hyperParamsFrame);
    sidebarRight.append(checkboxesFrame);

      miroEtFrame.append(radioButtonTooltip);
        radioButtonTooltip.append(radioButtonBlockTooltip);
        radioButtonTooltip.append(radioSet);

      miroEtFrame.append(lrMiroTooltip);
        lrMiroTooltip.append(lrMiroBlockTooltip);
        lrMiroTooltip.append(lrMiroInput);
        lrMiroTooltip.append(lrMiroLabel);

      miroEtFrame.append(entMiroTooltip);
        entMiroTooltip.append(entMiroBlockTooltip);
        entMiroTooltip.append(entMiroInput);
        entMiroTooltip.append(entMiroLabel);

      hyperParamsFrame.append(temperatureTooltip);
        temperatureTooltip.append(temperatureBlockTooltip);
        temperatureTooltip.append(temperatureInput);
        temperatureTooltip.append(temperatureLabel);

      hyperParamsFrame.append(maxTokensTooltip);
        maxTokensTooltip.append(maxTokensBlockTooltip);
        maxTokensTooltip.append(maxTokensInput);
        maxTokensTooltip.append(maxTokensLabel);

      hyperParamsFrame.append(topPTooltip);
        topPTooltip.append(topPBlockTooltip);
        topPTooltip.append(topPInput);
        topPTooltip.append(topPLabel);
      
      hyperParamsFrame.append(nPredictTooltip);
        nPredictTooltip.append(nPredictBlockTooltip);
        nPredictTooltip.append(nPredictInput);
        nPredictTooltip.append(nPredictLabel);

      hyperParamsFrame.append(topKTooltip);
        topKTooltip.append(topKBlockTooltip);
        topKTooltip.append(topKInput);
        topKTooltip.append(topKLabel);
  
      hyperParamsFrame.append(repeatLastTooltip);
        repeatLastTooltip.append(repeatLastBlockTooltip);
        repeatLastTooltip.append(repeatLastInput);
        repeatLastTooltip.append(repeatLastLabel);
  
      hyperParamsFrame.append(LTSTooltip);
        LTSTooltip.append(LTSBlockTooltip);
        LTSTooltip.append(LTSInput);
        LTSTooltip.append(LTSLabel);
  
      hyperParamsFrame.append(presencePenaltyTooltip);
        presencePenaltyTooltip.append(presencePenaltyBlockTooltip);
        presencePenaltyTooltip.append(presencePenaltyInput);
        presencePenaltyTooltip.append(presencePenaltyLabel);
  
      hyperParamsFrame.append(advancedTooltip);
        advancedTooltip.append(advancedBlockTooltip);
        advancedTooltip.append(advancedInput);
        advancedTooltip.append(advancedLabel);

      checkboxesFrame.append(historyTooltip);
        historyTooltip.append(historyBlockTooltip);
        historyTooltip.append(historyCheckbox);

      checkboxesFrame.append(storeTextTooltip);
        storeTextTooltip.append(storeTextBlockTooltip);
        storeTextTooltip.append(storeTextCheckbox);

      checkboxesFrame.append(semanticMemoryTooltip);
        semanticMemoryTooltip.append(semanticMemoryBlockTooltip);
        semanticMemoryTooltip.append(semanticMemoryCheckbox);

      checkboxesFrame.append(appendMemoryTooltip);
        appendMemoryTooltip.append(appendMemoryBlockTooltip);
        appendMemoryTooltip.append(appendMemoryCheckbox);
//
// --------------------------------------------





// const printError = (error) => {
//   if (DEBUG_MODE) {
//     console.error(error);
//   }
// };





// --------------------------------------------
// create a timestamp
//
let sessionTimestamp;

const getSessionTimestamp = () => {
  if (!sessionTimestamp) {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toISOString().slice(11, 16).replace(/:/g, '');
    sessionTimestamp = `${date}-${time}`;
  }
  return sessionTimestamp;
};
//
// --------------------------------------------





// --------------------------------------------
// unterordner erstellen
//
const createFolderIfNotExists = async (folderPath) => {
    try {
      await fsPromises.access(folderPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fsPromises.mkdir(folderPath, { recursive: true });
      } else {
        throw error;
      }
    }
  };
  //
  // --------------------------------------------





const pachaFolderPath = path.join(__dirname, 'pacha');
const notesFolderPath = path.join(pachaFolderPath, 'notes');
const sessionsFolderPath = path.join(pachaFolderPath, 'sessions');





// --------------------------------------------
//
let selectedModel = '';

fileList.on('select', (item, index) => {
  selectedModel = item.getContent();
 }
)

async function findBinFiles(folderPath, fileListItems = []) {
  try {
    const files = await fsPromises.readdir(folderPath);
    for (const file of files) {
      if (file.startsWith('._')) {
        continue;
      }
      const filePath = path.join(folderPath, file);
      const fileStat = await fsPromises.stat(filePath);

      if (fileStat.isDirectory()) {
        await findBinFiles(filePath, fileListItems);
      } else if (path.extname(file) === '.bin') {
        fileListItems.push(filePath);
      }
    }
  } catch (err) {
    console.error(`Error when reading the folder: ${err.message}`);
  }
  return fileListItems;
}
//
// --------------------------------------------





// --------------------------------------------
// function to save the text history in a file
//
// const saveTextHistory = (text) => {
//   const outputPath = path.join(__dirname, 'text_history.md');
//   fs.appendFileSync(outputPath, text, 'utf8');
// };
const saveTextHistory = async (text) => {
    const sessionTimestamp = getSessionTimestamp();
    const outputPath = path.join(sessionsFolderPath, `${sessionTimestamp}.md`);
    await createFolderIfNotExists(sessionsFolderPath);
    await fsPromises.appendFile(outputPath, text, 'utf8');
  };
//
// --------------------------------------------





// --------------------------------------------
// function to log the commands
//
// const logCommand = (command, args) => {
//   const logFilePath = path.join(__dirname, 'pacha_log.txt');
const logCommand = async (command, args) => {
    const logFilePath = path.join(pachaFolderPath, 'log_datei.md');
    await createFolderIfNotExists(pachaFolderPath);
    const logEntry = `\n- - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n\n\n\n\n====== LOG DATE ======\n\n${new Date().toISOString()}\n\n\n\n====== COMMAND LOGGED ======\n\n${command} ${args.join(' ')}\n\n\n\n\n====== RAW OUTPUT FROM LLAMA.CPP ======\n\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
};
//
// --------------------------------------------





// --------------------------------------------
// function to log the raw output
//
// const logOutput = (output) => {
//   const logFilePath = path.join(__dirname, 'pacha_log.txt');
const logOutput = async (output) => {
    const logFilePath = path.join(pachaFolderPath, 'log_datei.md');
    await createFolderIfNotExists(pachaFolderPath);
    fs.appendFileSync(logFilePath, output, 'utf8');
};
//
// --------------------------------------------





// --------------------------------------------
// function to check if pathname is valid
//
function isValidModelPath(modelPath) {
  return path.extname(modelPath) === '.bin';
}
//
// --------------------------------------------





// --------------------------------------------
// function for generating prefixes and suffixes
//
const getPrefixSuffix = (selectedDropDown) => {
  let prePrefix = '';
  let prefix = '';
  let suffix = '';

  switch (selectedDropDown) {
    case 'Custom/None':
        prePrefix = '';
        prefix = '';
        suffix = '';
        break;
    case 'Instruction':
        prePrefix = '';
        prefix = '### Instruction:\n';
        suffix = '\n### Response:';
        break;
    case 'Airoboros':
        prePrefix = '';
        prefix = 'USER: \n';
        suffix = 'ASSISTANT:';
        break;
    case 'Alpaca':
        prePrefix = 'Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n';
        prefix = '### Instruction:\n';
        suffix = '\n\n### Response:';
        break;
    case 'based':
        prePrefix = 'You are an an AI who shares your opinions, thoughts, and feelings.\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        break;
    case 'CAMEL Combined':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        break;
    case 'Chronos':
        prePrefix = '';
        prefix = '### Instruction:\n';
        suffix = '\n### Response:';
        break;
    case 'Gorilla':
        prePrefix = '';
        prefix = '###USER: ';
        suffix = '\n###ASSISTANT:';
        break;
    case 'GPT4 x Alpaca':
        prePrefix = 'Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n';
        prefix = '### Instruction:\n';
        suffix = '\n\n### Response:';
        break;
    case 'GPT4 x Vicuna':
        prePrefix = '';
        prefix = '### Instruction:\n';
        suffix = '\n\n### Response:\n';
        break;
    case 'Guanaco':
        prePrefix = '';
        prefix = '### Human: ';
        suffix = '\n### Assistant: ';
        break;
    case 'Guanaco QLoRA':
        prePrefix = '';
        prefix = '### Human: ';
        suffix = '\n\n### Assistant:';
        break;
    case 'H2O\'s GPT-GM-OASST1-Falcon 40B v2':
        prePrefix = '';
        prefix = '<|prompt|>';
        suffix = '<|endoftext|>\n<|answer|>';
        break;
    case 'Hippogriff':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        break;
    case 'Karen The Editor':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        break;
    case 'Lazarus 30B, ':
        prePrefix = 'Below is an instruction that describes a task. Write a response that appropriately completes the request\n\n';
        prefix = '### Instruction: ';
        suffix = '\n\n### Response:';
        break;
    case 'Manticore':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        break;
    case 'Minotaur':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
    case 'MPT 30B':
        prePrefix = '<|im_start|>system\nA conversation between a user and an LLM-based AI assistant. The assistant gives helpful and honest answers.<|im_end|>';
        prefix = '\n<|im_start|>user\n';
        suffix = '<|im_end|>\n<|im_start|>assistant';
    case 'Nous Hermes':
        prePrefix = '';
        prefix = '### Instruction: ';
        suffix = '\n\n### Response:';
        break;
    case 'OpenAssistant LLaMA':
        prePrefix = '### System\nYou are an AI assistant that follows instruction extremely well. Help as much as you can.';
        prefix = '<|prompter|>';
        suffix = '<|endoftext|><|assistant|>';
        break;
    case 'Orca Mini':
        prePrefix = '### System\nYou are an AI assistant that follows instruction extremely well. Help as much as you can.';
        prefix = '\n\n### User:\n';
        suffix = '\n\n### Response:';
        break;
    case 'Samantha':
        prePrefix = 'You are Samantha, a sentient AI.\n\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        break;
    case 'Stable Vicuna':
        prePrefix = 'A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human\'s questions.\n\n';
        prefix = '### Human: ';
        suffix = '\n### Assistant:';
        break;
    case 'Starchat':
        prePrefix = '<|system|> Below is a conversation between a human user and a helpful AI coding assistant. <|end|>\n';
        prefix = '<|user|> ';
        suffix = ' <|end|>\n<|assistant|>';
        break;
    case 'Tulu':
        prePrefix = '';
        prefix = '<|user|>\n';
        suffix = '\n<|assistant|>\n';
        break;
    case 'Vicuna V0':
        prePrefix = 'A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human\'s questions.\n\n';
        prefix = '### Human: ';
        suffix = '\n### Assistant:';
        break;
    case 'Vicuna V1.1 & V1.3':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n\n';
        prefix = 'USER: ';
        suffix = 'ASSISTANT:';
        break;
    case 'Vigogne Chat':
        prePrefix = 'Below is a conversation between a user and an AI assistant named Vigogne.\nVigogne is an open-source AI assistant created by Zaion (https://zaion.ai/).\nVigogne is polite, emotionally aware, humble-but-knowledgeable, always providing helpful and detailed answers.\nVigogne is skilled in responding proficiently in the languages its users use and can perform a wide range of tasks such as text editing, translation, question answering, logical reasoning, coding, and many others.\nVigogne cannot receive or generate audio or visual content and cannot access the internet.\nVigogne strictly avoids discussing sensitive, offensive, illegal, ethical, or political topics and caveats when unsure of the answer.\n\n';
        prefix = '<|UTILISATEUR|>: ';
        suffix = '\n<|ASSISTANT|>:';
        break;
    case 'Vigogne Instruct':
        prePrefix = 'Ci-dessous se trouve une instruction qui décrit une tâche à accomplir. Rédigez une réponse qui répond de manière précise à la demande.';
        prefix = '<|UTILISATEUR|>: ';
        suffix = '\n<|ASSISTANT|>:';
        break;
    case 'WizardLM 7B':
        prePrefix = '';
        prefix = '';
        suffix = '\n\n### Response: ';
        break;
    case 'WizardLM 13B & 30B V1.0':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions. ';
        prefix = 'USER: ';
        suffix = ' ASSISTANT:';
        break;
    case 'WizardLM 33B V1.0 Uncensored':
        prePrefix = 'You are a helpful AI assistant.\n\n';
        prefix = 'USER: ';
        suffix = 'ASSISTANT:';
    case 'WizardVicunaLM':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
    default:
        break;
  }
  return { prePrefix, prefix, suffix };
};
//
// --------------------------------------------





// --------------------------------------------
// function to save personal notes
//
function saveMultiNotes() {
    const notesContent = multiNotes.getValue();
    const timestamp = new Date().toISOString();
    const timestampFile = Math.floor(Date.now() / 1000);
    const modelInfo = `Modell: ${selectedModel}`;
    const promptTemplate = `Prompt-Template: ${dropDownOptions[dropDown.selected]}`;
    const parameters = `Args: ${args.join(' ')}`;

    const notesText = `---\n\n${timestamp}\n\n${modelInfo}\n${promptTemplate}\n${parameters}\n\n${notesContent}\n\n---\n`;

    const fileName = `${selectedModel}_${timestampFile}.md`;
    const outputPath = path.join(notesFolderPath, fileName);
    createFolderIfNotExists(notesFolderPath).then(() => {
    fsPromises.appendFile(outputPath, notesText, 'utf8');
    });
}
//
// --------------------------------------------





// --------------------------------------------
//
  const executeCommand = (text) => {
    const selectedDropDown = dropDownOptions[dropDown.selected];
    const { prePrefix, prefix, suffix } = getPrefixSuffix(selectedDropDown);

    const modelPath = path.join(modelsFolder, selectedModel);
      if (!isValidModelPath(modelPath)) {
        outputBox.insertBottom('Error: Invalid model path. Please select a .bin file.');
        screen.render();
        return;
      }

    const historyEnabled = historyCheckbox.checked;
    const storeTextEnabled = storeTextCheckbox.checked;
  
    let gptInput = text;
    let gptOutput = '';
  
    if (historyEnabled) {
      gptInput = `${prePrefix}${prefix}${text}${suffix}`;
    } else {
      gptInput = `${prefix}${text}${suffix}`;
    }
    const command = './main';
    const args = [
      '-m',
      path.join(modelsFolder, selectedModel), 
      '-n',
      '58',
    ];

    if (temperatureInput.getValue() !== '') {
      args.push('--temp', temperatureInput.getValue());
    }
    if (maxTokensInput.getValue() !== '') {
      args.push('-c', maxTokensInput.getValue());
    }
    if (topPInput.getValue() !== '') {
      args.push('--top-p', topPInput.getValue());
    }
    if (nPredictInput.getValue() !== '') {
      args.push('--n-predict', nPredictInput.getValue());
    }
    if (topKInput.getValue() !== '') {
      args.push('--top-k', topKInput.getValue());
    }
    if (repeatLastInput.getValue() !== '') {
      args.push('--repeat-last-n', repeatLastInput.getValue());
    }
    if (LTSInput.getValue() !== '') {
      args.push('--typical', LTSInput.getValue());
    }
    if (presencePenaltyInput.getValue() !== '') {
      args.push('--presence-penalty', presencePenaltyInput.getValue());
    }
    // if (seedInput.getValue() !== '') {
    //   args.push('--seed', seedInput.getValue());
    // }
    // if (threadsInput.getValue() !== '') {
    //   args.push('--threads', threadsInput.getValue());
    // }
    // if (promptCacheInput.getValue() !== '') {
    //   args.push('--prompt-cache', promptCacheInput.getValue());
    // }
    // if (fileInput.getValue() !== '') {
    //   args.push('--file', fileInput.getValue());
    // }
    // if (tfsInput.getValue() !== '') {
    //   args.push('--tfs', tfsInput.getValue());
    // }
    // if (repeatPenaltyInput.getValue() !== '') {
    //   args.push('--repeat-penalty', repeatPenaltyInput.getValue());
    // }
    // if (frequencyPenaltyInput.getValue() !== '') {
    //   args.push('--frequency-penalty', frequencyPenaltyInput.getValue());
    // }
    // if (batchSizeInput.getValue() !== '') {
    //   args.push('--batch-size', batchSizeInput.getValue());
    // }
    // if (keepInput.getValue() !== '') {
    //   args.push('--keep', keepInput.getValue());
    // }
    // if (nGpuLayersInput.getValue() !== '') {
    //   args.push('--n-gpu-layers', nGpuLayersInput.getValue());
    // }
    if (advancedInput.getValue() !== '') {
      args.push(presencePenaltyInput.getValue());
    }
    if (lrMiroInput.getValue() !== '') {
      args.push('--mirostat-lr', lrMiroInput.getValue());
    }
    if (entMiroInput.getValue() !== '') {
      args.push('--mirostat-ent', entMiroInput.getValue());
    }
    if (radioSet.children[1].checked) {
      args.push('--mirostat', '1');
    } else if (radioSet.children[2].checked) {
      args.push('--mirostat', '2');
    }
    args.push('-p', `${gptInput}`);
    logCommand(command, args);

const child = spawn(command, args, { stdio: ['inherit', 'pipe', 'pipe'] });

let output = ''; // Variable for saving the output

child.stdout.on('data', (data) => {
  output += data.toString();
  gptOutput += data.toString();
  const userOutput = gptOutput.replace(`${prefix}${text}${suffix}`, '');
  // outputBox.setContent(`\nYou\n${text}\n\nAssistant${userOutput}\n`);
  const formattedOutput = `\n\u001b[1;30mYou\n\u001b[0m\u001b[1;90m${text}\u001b[0m\n\n\u001b[1;90mAssistant\u001b[0m${userOutput}\n`;
  outputBox.setContent(formattedOutput);
  screen.render();
  if (storeTextEnabled) {
    saveTextHistory(`\nYou\n${text}\n\nAssistant\n${userOutput}\n`);
  }
  logOutput(data.toString());
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
// Handle error output if needed
child.stderr.on('data', (data) => { 
  logOutput(data.toString());
 }
)

child.on('error', (error) => {
  outputBox.insertBottom(`Fehler: ${error.message}`);
  screen.render();
 }
)
};
//
// --------------------------------------------





// --------------------------------------------
//
const modelsFolderArgIndex = args.indexOf('-m');
if (modelsFolderArgIndex !== -1 && modelsFolderArgIndex + 1 < args.length) {
  const modelsArg = args[modelsFolderArgIndex + 1];
  if (path.extname(modelsArg) === '.bin') {
    selectedModel = path.basename(modelsArg);
    modelsFolder = path.dirname(modelsArg);
  } else {
    modelsFolder = modelsArg;
  }
} else {
  modelsFolder = './models';
}

// findBinFiles(modelsFolder);
findBinFiles(modelsFolder).then(binFiles => { 
  const fileNames = binFiles.map(filePath => path.basename(filePath));
  fileList.setItems(fileNames);
  fileList.focus();
  screen.render();
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
function setBackgroundColor(usage) {
  if (usage >= 0 && usage <= 15) {
    topBar.style.bg = '#555753';
  } else if (usage >= 16 && usage <= 50) {
    topBar.style.bg = '#4e9a06';
  } else if (usage >= 51 && usage <= 72) {
    topBar.style.bg = '#8ae234';
  } else if (usage >= 73 && usage <= 86) {
    topBar.style.bg = 'cyan';
  } else if (usage >= 87 && usage <= 95) {
    topBar.style.bg = 'magenta';
  } else if (usage >= 96) {
    topBar.style.bg = 'red';
  }
}

const cpuValues = [];
const numValuesForAverage = 10;

function updateCpuUsage() {
  osUtils.cpuUsage(function(usage) {
    cpuValues.push(usage * 100);
    if (cpuValues.length > numValuesForAverage) {
      cpuValues.shift();
    }
    const cpuUsageAverage = cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length;
    const cpuUsagePercentage = cpuUsageAverage.toFixed(0);
    topBarLabel.setContent(`CPU ${cpuUsagePercentage}%`);
    setBackgroundColor(cpuUsagePercentage);
    screen.render();
  });
}

setInterval(updateCpuUsage, 200);
//
// --------------------------------------------





// --------------------------------------------
//

sendButton.on('press', () => {
  const text = inputBox.getValue();
  executeCommand(text);
  inputBox.clearValue();
  screen.render();
 }
)

inputBox.on('submit', () => {
  const text = inputBox.getValue();
  if (text.trim() !== '') {
    executeCommand(text);
    inputBox.clearValue();
    screen.render();
  }
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
screen.key(['C-c', 'enter'], (ch, key) => {
  if (key.name === 'enter' && screen.focused instanceof blessed.Textbox) {
    return;
  }
  process.exit(0);
 }
)

multiNotesSaveLabel.on('click', () => {
  saveMultiNotes();
});

screen.render();
//
// --------------------------------------------