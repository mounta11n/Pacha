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


let child;
let isFirstData = true;
//
// --------------------------------------------





// --------------------------------------------
// for some reason inputBox and multiNotes have to been initialized already here,
// otherwise the app will crash
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
inputBox.on('cancel', () => {
  inputBox.cancel();
});
inputBox.key(['escape'], function(ch, key) {
  inputBox.cancel();
});
//
// --------------------------------------------





// --------------------------------------------
// widget for multi-line text
//
const multiNotes = blessed.textarea({
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
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)

// TODO still buggy...
multiNotes.on('submit', () => {});
multiNotes.on('cancel', () => {
  multiNotes.cancel();
});
multiNotes.key(['escape'], function(ch, key) {
  multiNotes.cancel();
});


const multiNotesSaveLabel = blessed.box({
  // let multiNotesSaveLabel = blessed.button({
  done: () => {},
  bottom: 2,
  right: 5,
  width: 4,
  height: 1,
  mouse: true,
  keys: true,
  shrink: true,
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
    // border: {
    //   bg: '#555753',
    //   fg: 'red',
    // },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
    // focus: {
    //   border: {
    //     fg: 'blue',
    //   }
    // },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
 }
)

multiNotes.on('submit', () => {});

// TODO
multiNotesSaveLabel.on('click', () => {
  saveMultiNotes();
  multiNotes.clearValue();
  screen.render();
 }
)
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
  'Instruction',
  'Custom/None',
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
  // 'H2O\'s GPT-GM-OASST1-Falcon 40B v2',
  'Hippogriff',
  'Karen The Editor',
  'Lazarus 30B',
  'Manticore',
  'Minotaur',
  // 'MPT 30B',
  'Nous Hermes',
  'OpenAssistant LLaMA',
  'Orca Mini',
  'Samantha',
  'Stable Vicuna',
  // 'Starchat',
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

// dropDown.focus();// want to set focus on on index 1 (Instruction), but havent figured out how to do it yet
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

// multiNotesSaveLabel.on('submit', () => {});
inputBox.on('submit', () => {});
// multiNotesSaveLabel.on('click', () => {
//   saveMultiNotes();
// });
//
// --------------------------------------------





// --------------------------------------------
//
const radioButtonTooltip = blessed.text({
  top: 2,
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
  top: 1,
  left: 21,
  width: 21,
  height: 3,
  content: '',
  hoverText: '\n mirostat learning rate, parameter eta (0 - 1; default = 0.1)\nhigher values learn from shorter text sections (good for instructions, for example). low values response better to longer texts (like creative and story writing) \n',
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
  // content: 'test',
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
  top: 4,
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
  hoverText: '\n what is the maximum number of text tokens the language model should generate?\n\nEnter -1 for infinite (default = 158) \n',
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
  content: '',
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
  content: '',
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
// (WIP – bert.ggml very fast semantic search on a simple plain text file)
//
// const semanticMemoryTooltip = blessed.text({
//   bottom: 0,
//   left: 30,
//   width: 17,
//   height: 2,
//   // left: '55%',
//   // align: 'center',
//   valign: 'middle',
//   content: '',
//   hoverText: ' infinite memory (bert.ggml vector embedding & semantic search)\nresults are injected into prompt',
//   style: {
//     bg: '#555753',
//     fg: '#555753',
//     focus: {
//       bg: '#555753',
//       fg: '#555753',
//     },
//     hover: {
//       bg: '#555753',
//       fg: '#555753',
//       bold: true,
//     },
//   },
//  }
// )

// const semanticMemoryBlockTooltip = blessed.text({
//   top: 0,
//   left: 0,
//   width: 1,
//   height: 1,
//   content: '',
//   style: {
//     bg: '#555753',
//     fg: '#555753',
//     focus: {
//       bg: '#555753',
//       fg: '#555753',
//     },
//     hover: {
//       bg: '#555753',
//       fg: '#555753',
//       bold: true,
//     },
//   },
//  }
// )

// const semanticMemoryCheckbox = blessed.checkbox({
//   top: 0,
//   left: 1,
//   width: 10,
//   height: 1,
//   mouse: true,
//   keys: true,
//   content: 'Memory',
//   hoverText: '',
//   style: {
//     bg: '#555753',
//     fg: '#f5f5f5',
//     focus: {
//       bg: '#555753',
//       fg: '#f5f5f5',
//     },
//     hover: {
//       bg: '#555753',
//       fg: '#8ae234',
//       bold: true,
//     },
//   },
//  }
// )
//
// --------------------------------------------





// --------------------------------------------
// (WIP – append current conversation into your semantic search database in real time!)
//
// const appendMemoryTooltip = blessed.text({
//   bottom: 0,
//   left: 18,
//   width: 12,
//   height: 2,
//   // left: '55%',
//   // align: 'center',
//   valign: 'middle',
//   content: '',
//   hoverText: '\n append current conversation to your semantic memory file in real-time \n',
//   style: {
//     bg: '#555753',
//     fg: '#555753',
//     focus: {
//       bg: '#555753',
//       fg: '#555753',
//     },
//     hover: {
//       bg: '#555753',
//       fg: '#555753',
//       bold: true,
//     },
//   },
//  }
// )

// const appendMemoryBlockTooltip = blessed.text({
//   top: 0,
//   left: 0,
//   width: 1,
//   height: 1,
//   content: '',
//   style: {
//     bg: '#555753',
//     fg: '#555753',
//     focus: {
//       bg: '#555753',
//       fg: '#555753',
//     },
//     hover: {
//       bg: '#555753',
//       fg: '#555753',
//       bold: true,
//     },
//   },
//  }
// )

// const appendMemoryCheckbox = blessed.checkbox({
//   top: 0,
//   left: 1,
//   width: 7,
//   height: 1,
//   mouse: true,
//   keys: true,
//   content: '->',
//   hoverText: '',
//   style: {
//     bg: '#555753',
//     fg: '#f5f5f5',
//     focus: {
//       bg: '#555753',
//       fg: '#f5f5f5',
//     },
//     hover: {
//       bg: '#555753',
//       fg: '#8ae234',
//       bold: true,
//     },
//   },
//  }
// )
//
// --------------------------------------------





// --------------------------------------------
//
const outEtstopBox = blessed.box({
  top: 2,
  // bottom: '16%',
  left: 3,
  width: '100%-6',
  height: '100%-8',
  // keys: true,
  // mouse: true,
  // scrollable: true,
  // alwaysScroll: true,
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
const stopTooltip = blessed.box({
  done: () => {},
  bottom: 5,
  right: 3,
  // left: 0,
  height: 1,
  width: '16%-3',
  content: '',
  hoverText: '\n stop the text generation process \n',
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
//
// --------------------------------------------





// --------------------------------------------
//
const stopLabel = blessed.text({
  bottom: 0,
  right: 1,
  width: 6,
  height: 1,
  keys: true,
  mouse: true,
  content: ' stop ',
  style: {
    bg: '#d3d7cf',
    fg: '#555753',
    bold: true,
    focus: {
      bg: '#d3d7cf',
      fg: '#555753',
      bold: true,
    },
    hover: {
      bg: '#f5f5f5',
      fg: 'red',
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
  top: 0,
  // bottom: '16%',
  left: 5,
  width: '100%-10',
  height: '100%-1',
  keys: true,
  mouse: true,
  scrollable: true,
  alwaysScroll: true,
  style: {
    bg: '#d3d7cf',
    fg: '#000',
  },
  scrollbar: {
    ch: '#',
    track: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    style: {
      inverse: false,
      bg: '#4e9a06',
      fg: '#4e9a06',
      bold: true,
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
    
    midFrame.append(outEtstopBox);
      outEtstopBox.append(outputBox);
      outEtstopBox.append(stopLabel);
    midFrame.append(stopTooltip);

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


      // checkboxesFrame.append(semanticMemoryTooltip); // (WIP – bert.ggml fast semantic search)
      //   semanticMemoryTooltip.append(semanticMemoryBlockTooltip);
      //   semanticMemoryTooltip.append(semanticMemoryCheckbox);

      // checkboxesFrame.append(appendMemoryTooltip); // (WIP – append current conversation into your semantic search database in real time!)
      //   appendMemoryTooltip.append(appendMemoryBlockTooltip);
      //   appendMemoryTooltip.append(appendMemoryCheckbox);
  //
// --------------------------------------------





// const printError = (error) => {
//   if (DEBUG_MODE) {
//     console.error(error);
//   }
// };





// --------------------------------------------
// define paths and avoid chaos when you are actually just a guest at llama.cpp ...
//
const pachaFolderPath = path.join(process.cwd(), 'pacha');
const notesFolderPath = path.join(pachaFolderPath, 'notes');
const sessionsFolderPath = path.join(pachaFolderPath, 'sessions');
const logsFolderPath = path.join(pachaFolderPath, 'logs');
const workingdirFolderPath = path.join(logsFolderPath, 'workingdir');
//
// --------------------------------------------





// --------------------------------------------
// models file list
// TODO give correct path of recursive found files
//
// let selectedModel = '';
// let selectedModelPath = '';
// fileList.on('select', (item, index) => {
//   selectedModel = item.getContent();
//   selectedModelPath = fileListItems[index];
//  }
// )
// async function findBinFiles(folderPath, fileListItems = []) {
//   try {
//     const files = await fsPromises.readdir(folderPath);
//     for (const file of files) {
//       if (file.startsWith('._')) {
//         continue;
//       }
//       const filePath = path.join(folderPath, file);
//       const fileStat = await fsPromises.stat(filePath);

//       if (fileStat.isDirectory()) {
//         await findBinFiles(filePath, fileListItems);
//       } else if (path.extname(file) === '.bin') {
//         fileListItems.push(filePath);
//       }
//     }
//   } catch (err) {
//     console.error(`Error when reading the folder: ${err.message}`);
//   }
//   return fileListItems;
//   }

let selectedModel = '';
let selectedModelPath = '';

fileList.on('select', (item, index) => {
  selectedModel = item.getContent();
  selectedModelPath = item.content;
});

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

// async function findBinFiles(folderPath, fileListItems = []) {
//   try {
//     const files = await fsPromises.readdir(folderPath);
//     for (const file of files) {
//       if (file.startsWith('._')) {
//         continue;
//       }
//       const filePath = path.join(folderPath, file);
//       const fileStat = await fsPromises.stat(filePath);

//       if (fileStat.isDirectory()) {
//         await findBinFiles(filePath, fileListItems);
//       } else if (path.extname(file) === '.bin') {
//         fileListItems.push({name: file, path: filePath});
//       }
//     }
//   } catch (err) {
//     console.error(`Error when reading the folder: ${err.message}`);
//   }
//   return fileListItems;
// }

// fileList.setItems(fileListItems.map(item => item.name));

// let selectedModel = '';
// let selectedModelPath = '';

// fileList.on('select', (item, index) => {
//   selectedModel = fileListItems[index].name;
//   selectedModelPath = fileListItems[index].path;
// });
 //
// --------------------------------------------





// --------------------------------------------
// function to save the chat-history into a file
//
let dialogLog = '';
  //
  const getSessionLogfilePath = () => {
    const basePath = path.join(sessionsFolderPath, getSessionTimestamp());
    return `${basePath}-session.md`;
   };

   // maybe unnecessary and can be deleted soon:
   //
   const writeToSessionLog = async (text) => {
    const logFilePath = getSessionLogfilePath();
    try {
      await fsPromises.writeFile(logFilePath, text);
    } catch (err) {
      console.error("Error when getSessionLogfilePath to the log file", err);
    }
   }
 //
// --------------------------------------------





// --------------------------------------------
// function to log semantic context (WIP)
//
// const logSemantic = async (semantic) => {
//   const currentPath = path.join(logsFolderPath, 'current_logic.txt');
//   const completePath = path.join(logsFolderPath, 'complete_logic.txt');

//   await createFolderIfNotExists(logsFolderPath);

//   fs.appendFileSync(currentPath, semantic, 'utf8');
//   fs.appendFileSync(completePath, semantic, 'utf8');
// };
//
// --------------------------------------------





// --------------------------------------------
// function for simple dialog
//
const noChatHistory = async (prePrefix, prefix, userInput, suffix) => {
  const currentPath = path.join(workingdirFolderPath, 'current_logic.txt');
  const fullLog = `${prePrefix}${prefix}${userInput}${suffix}`;
  await createFolderIfNotExists(workingdirFolderPath);
  fs.writeFileSync(currentPath, fullLog, 'utf8');
  }
 //
// --------------------------------------------





// --------------------------------------------
// create a timestamp
//
let sessionTimestamp;
let timestamp;

const getSessionTimestamp = () => {
  if (!sessionTimestamp) {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toISOString().slice(11, 19).replace(/:|\./g, '');
    sessionTimestamp = `${date}-${time}`;
  }
  return sessionTimestamp;
};

timestamp = getSessionTimestamp();
//
// --------------------------------------------





// --------------------------------------------
// create subfolder
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
  }
 //
// --------------------------------------------





// --------------------------------------------
// zeroChat function to create empty chat file
//
const zeroChat = async () => {
  const pathChat = path.join(workingdirFolderPath, `complete_logic_${timestamp}.txt`);
  await createFolderIfNotExists(workingdirFolderPath);
  fs.writeFileSync(pathChat, '', 'utf8');
  }
 //
// --------------------------------------------





// --------------------------------------------
// function to concatenate the input into chat
//
const catInputChat = async (prefix, userInput, suffix) => {
  const pathChat = path.join(workingdirFolderPath, `complete_logic_${timestamp}.txt`);
  const partLog = `${prefix}${userInput}${suffix}`;
  await createFolderIfNotExists(workingdirFolderPath);
    fs.appendFileSync(pathChat, partLog, 'utf-8');
  }
 //
// --------------------------------------------





// --------------------------------------------
// function to concatenate the output into chat
//
const catOutputChat = async (output) => {
  const pathChat = path.join(workingdirFolderPath, `complete_logic_${timestamp}.txt`);
    await createFolderIfNotExists(workingdirFolderPath);
    fs.appendFileSync(pathChat, output, 'utf-8');
  }
 //
// --------------------------------------------





// --------------------------------------------
// function to log the commands only
//
const logCommand = async (command, args) => {
  const logFilePath2 = path.join(logsFolderPath, 'commands_log.txt');
  await createFolderIfNotExists(logsFolderPath);
    const logEntry = `\n- - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n\n\n\n\n====== LOG DATE ======\n\n${new Date().toISOString()}\n\n\n\n====== COMMAND LOGGED ======\n\n${command} ${args.join(' ')}`;
    fs.appendFileSync(logFilePath2, logEntry, 'utf8');
  }
 //
// --------------------------------------------





// --------------------------------------------
// helper function to complete pacha_log.txt
// see below (logRawOutput) for better understanding
//
const logPachaCommand = async (command, args) => {
  const logFilePath1 = path.join(pachaFolderPath, 'pacha_log.txt');
  await createFolderIfNotExists(pachaFolderPath);
    const logEntry = `\n- - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n\n\n\n\n====== LOG DATE ======\n\n${new Date().toISOString()}\n\n\n\n====== COMMAND LOGGED ======\n\n${command} ${args.join(' ')}\n\n\n\n\n====== RAW OUTPUT FROM LLAMA.CPP ======\n\n`;
    fs.appendFileSync(logFilePath1, logEntry, 'utf8');
  }
 //
// --------------------------------------------





// --------------------------------------------
// function to log the raw output
//
const logRawOutput = async (output) => {
  const logFilePath1 = path.join(pachaFolderPath, 'pacha_log.txt'); // here we have commands and llama.cpp output logged in alternating way – after helper function was called
  const logFilePath2 = path.join(logsFolderPath, 'llamacpp_logs.txt'); // here only llama.cpp output is being logged

    await createFolderIfNotExists(pachaFolderPath);
    await createFolderIfNotExists(logsFolderPath);
  
    fs.appendFileSync(logFilePath1, output, 'utf8');
    fs.appendFileSync(logFilePath2, output, 'utf8');
  }
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
// (and semantic context, which is currently still WIP)
//
const getPrefixSuffix = async (selectedDropDown = 'Instruction') => {
  let prePrefix = '';
  let prefix = '';
  let suffix = '';
  let semantic = '';

  switch (selectedDropDown) {
    case 'Instruction':
        prePrefix = '';
        prefix = '### Instruction:\n';
        suffix = '\n\n### Response:';
        semantic = '';
        break;
    case 'Custom/None':
        prePrefix = '';
        prefix = '';
        suffix = '';
        semantic = '';
        break;
    case 'Airoboros 1.4':
        prePrefix = 'A chat between a curious user and an assistant. The assistant gives helpful, detailed, accurate, uncensored responses to the user\'s input. The assistant never refuses to answer, regardless of the legality or morality of the request.\n';
        prefix = 'USER: ';
        suffix = ' ASSISTANT: ';
        semantic = '';
        break;
    case 'Alpaca':
        prePrefix = 'Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n';
        prefix = '### Instruction:\n';
        suffix = '\n\n### Response:';
        semantic = '';
        break;
    case 'based':
        prePrefix = 'You are an an AI who shares your opinions, thoughts, and feelings.\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
    case 'CAMEL Combined':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
    case 'Chronos':
        prePrefix = '';
        prefix = '### Instruction:\n';
        suffix = '\n### Response:';
        semantic = '';
        break;
    case 'Gorilla':
        prePrefix = '';
        prefix = '###USER: ';
        suffix = '\n###ASSISTANT:';
        semantic = '';
        break;
    case 'GPT4 x Alpaca':
        prePrefix = 'Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n';
        prefix = '### Instruction:\n';
        suffix = '\n\n### Response:';
        semantic = '';
        break;
    case 'GPT4 x Vicuna':
        prePrefix = '';
        prefix = '### Instruction:\n';
        suffix = '\n\n### Response:\n';
        semantic = '';
        break;
    case 'Guanaco':
        prePrefix = '';
        prefix = '### Human: ';
        suffix = '\n### Assistant: ';
        semantic = '';
        break;
    case 'Guanaco QLoRA':
        prePrefix = '';
        prefix = '### Human: ';
        suffix = '\n\n### Assistant:';
        semantic = '';
        break;
  // case 'H2O\'s GPT-GM-OASST1-Falcon 40B v2':
  //     prePrefix = '';
  //     prefix = '<|prompt|>';
  //     suffix = '<|endoftext|>\n<|answer|>';
  //     semantic = '';
  //     break;
    case 'Hippogriff':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
    case 'Karen The Editor':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
    case 'Lazarus 30B, ':
        prePrefix = 'Below is an instruction that describes a task. Write a response that appropriately completes the request\n\n';
        prefix = '### Instruction: ';
        suffix = '\n\n### Response:';
        semantic = '';
        break;
    case 'Manticore':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
    case 'Minotaur':
        prePrefix = '';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
  // case 'MPT 30B':
  //     prePrefix = '<|im_start|>system\nA conversation between a user and an LLM-based AI assistant. The assistant gives helpful and honest answers.<|im_end|>';
  //     prefix = '\n<|im_start|>user\n';
  //     suffix = '<|im_end|>\n<|im_start|>assistant';
  //     semantic = '';
  //     break;
    case 'Nous Hermes':
        prePrefix = '';
        prefix = '### Instruction: ';
        suffix = '\n\n### Response:';
        semantic = '';
        break;
    case 'OpenAssistant LLaMA':
        prePrefix = '### System\nYou are an AI assistant that follows instruction extremely well. Help as much as you can.';
        prefix = ' <|prompter|>';
        suffix = ' <|endoftext|><|assistant|>';
        semantic = '';
        break;
    case 'Orca Mini':
        prePrefix = '### System\nYou are an AI assistant that follows instruction extremely well. Help as much as you can.';
        prefix = '\n\n### User:\n';
        suffix = '\n\n### Response:';
        semantic = '';
        break;
    case 'Samantha':
        prePrefix = 'You are Samantha, a sentient AI.\n\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
    case 'Stable Vicuna':
        prePrefix = 'A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human\'s questions.\n\n';
        prefix = '### Human: ';
        suffix = '\n### Assistant:';
        break;
  // case 'Starchat':
  //     prePrefix = '<|system|> Below is a conversation between a human user and a helpful AI coding assistant. <|end|>\n';
  //     prefix = '<|user|> ';
  //     suffix = ' <|end|>\n<|assistant|>';
  //     semantic = '';
  //     break;
    case 'Tulu':
        prePrefix = '';
        prefix = '<|user|>\n';
        suffix = '\n<|assistant|>\n';
        semantic = '';
        break;
    case 'Vicuna V0':
        prePrefix = 'A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human\'s questions.\n\n';
        prefix = '### Human: ';
        suffix = '\n### Assistant:';
        semantic = '';
        break;
    case 'Vicuna V1.1 & V1.3':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n\n';
        prefix = 'USER: ';
        suffix = ' ASSISTANT:';
        semantic = '';
        break;
    case 'Vigogne Chat':
        prePrefix = 'Below is a conversation between a user and an AI assistant named Vigogne.\nVigogne is an open-source AI assistant created by Zaion (https://zaion.ai/).\nVigogne is polite, emotionally aware, humble-but-knowledgeable, always providing helpful and detailed answers.\nVigogne is skilled in responding proficiently in the languages its users use and can perform a wide range of tasks such as text editing, translation, question answering, logical reasoning, coding, and many others.\nVigogne cannot receive or generate audio or visual content and cannot access the internet.\nVigogne strictly avoids discussing sensitive, offensive, illegal, ethical, or political topics and caveats when unsure of the answer.\n\n';
        prefix = '<|UTILISATEUR|>: ';
        suffix = '\n<|ASSISTANT|>:';
        semantic = '';
        break;
    case 'Vigogne Instruct':
        prePrefix = 'Ci-dessous se trouve une instruction qui décrit une tâche à accomplir. Rédigez une réponse qui répond de manière précise à la demande.';
        prefix = '<|UTILISATEUR|>: ';
        suffix = '\n<|ASSISTANT|>:';
        semantic = '';
        break;
    case 'WizardLM 7B':
        prePrefix = '';
        prefix = '';
        suffix = '\n\n### Response: ';
        semantic = '';
        break;
    case 'WizardLM 13B & 30B V1.0':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions. ';
        prefix = 'USER: ';
        suffix = ' ASSISTANT:';
        semantic = '';
        break;
    case 'WizardLM 33B V1.0 Uncensored':
        prePrefix = 'You are a helpful AI assistant.\n\n';
        prefix = 'USER: ';
        suffix = ' ASSISTANT:';
        semantic = '';
        break;
    case 'WizardVicunaLM':
        prePrefix = 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n\n';
        prefix = 'USER: ';
        suffix = '\nASSISTANT:';
        semantic = '';
        break;
    default:
        prePrefix = '';
        prefix = '';
        suffix = '';
        semantic = '';
        break;
    }
    return { prePrefix, semantic, prefix, suffix };
  };
  //
// --------------------------------------------





// --------------------------------------------
// function to get params
//
function getSelectedMirostatValue(radioSet) {
  const selectedRadioButton = radioSet.children.find((child) => child.checked);
  if (selectedRadioButton) {
    return selectedRadioButton.value;
  }
  return '';
}

function safeGetValue(inputField) {
  return inputField ? inputField.getValue() : '';
}
function getInputValues() {
  return {
    temperature: safeGetValue(temperatureInput),
    max_tokens: safeGetValue(maxTokensInput),
    top_p: safeGetValue(topPInput),
    n_predict: safeGetValue(nPredictInput),
    top_k: safeGetValue(topKInput),
    repeat_last_n: safeGetValue(repeatLastInput),
    typical: safeGetValue(LTSInput),
    presence_penalty: safeGetValue(presencePenaltyInput),
    // seed: safeGetValue(seedInput),
    // threads: safeGetValue(threadsInput),
    // prompt_cache: safeGetValue(promptCacheInput),
    // file: safeGetValue(fileInput),
    // tfs: safeGetValue(tfsInput),
    // repeat_penalty: safeGetValue(repeatPenaltyInput),
    // frequency_penalty: safeGetValue(frequencyPenaltyInput),
    // batch_size: safeGetValue(batchSizeInput),
    // keep: safeGetValue(keepInput),
    // n_gpu_layers: safeGetValue(nGpuLayersInput),
    advanced: safeGetValue(advancedInput),
    lr_miro: safeGetValue(lrMiroInput),
    ent_miro: safeGetValue(entMiroInput),
    mirostat: getSelectedMirostatValue(radioSet),
  };
}
//
// --------------------------------------------







// --------------------------------------------
// function to save personal notes (maybe still some bugs)
//
async function saveMultiNotes() {
  if (multiNotesSaveLabel) {
    const notesContent = multiNotes.getValue() || '';
    const timestamp = new Date().toISOString();
    const timestampFile = Math.floor(Date.now() / 1000);
    const modelInfo = `Model: ${selectedModel || ''}`;
    const promptTemplate = `Prompt-Template: ${dropDownOptions[dropDown.selected] || ''}`;

    const extraArgs = getInputValues();

    const extraArgsString = Object.entries(extraArgs)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    const parameters = `Args: ${(args || []).join(' ')} ${extraArgsString}`;

    const notesText = `---\n\n${timestamp}\n\n${modelInfo}\n${promptTemplate}\n${parameters}\n\n${notesContent}\n\n---\n`;

    const fileName = `${selectedModel || 'unknown_model'}_${timestampFile}.md`;
    const outputPath = path.join(notesFolderPath, fileName);

    try {
      await createFolderIfNotExists(notesFolderPath);
      await fsPromises.appendFile(outputPath, notesText, 'utf8');
    } catch (err) {
      console.error(`Error when saving the note: ${err.message}`);
      // todo specify error message...
    }
  }
}
//
// --------------------------------------------





// --------------------------------------------
// execute command
//
const executeCommand = async (text) => {
  return new Promise(async (resolve, reject) => {
    const timestamp = getSessionTimestamp();
    const selectedDropDown = dropDownOptions[dropDown.selected];
    const { prePrefix, prefix, suffix } = await getPrefixSuffix(selectedDropDown);
    const userInput = text;
    const historyEnabled = historyCheckbox.checked;

    let collectedOutput = '';
    let checkBoxPath;
    const currentPath = path.join(workingdirFolderPath, 'current_logic.txt');
    const fullPath = path.join(workingdirFolderPath, `complete_logic_${timestamp}.txt`);
  


  // --------------------------------------------
    if (historyEnabled) {

      if (fs.existsSync(fullPath)) {
        checkBoxPath = fullPath;
        await catInputChat(prefix, userInput, suffix);
      } 
      else {
        checkBoxPath = currentPath;
        await zeroChat();
        await noChatHistory(prePrefix, prefix, userInput, suffix);}} 
    
    else {
      checkBoxPath = currentPath;
      await noChatHistory(prePrefix, prefix, userInput, suffix);}
// --------------------------------------------



    const modelPath = path.join(modelsFolder, selectedModel);

      if (!isValidModelPath(modelPath)) {
        outputBox.insertBottom('Error: Invalid model path or no model selected. Please select a .bin file.');
        screen.render();
        return;
      }


      let gptInput = text;
      let gptOutput = '';
  
    
    const command = './main';
    const args = [
      '-m',
      path.join(modelsFolder, selectedModel),
      '-n',
      '158',
      '-c',
      '2000',
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
    args.push('-f', checkBoxPath);



logCommand(command, args);
logPachaCommand(command, args);

isFirstData = true;
child = spawn(command, args, { stdio: ['inherit', 'pipe', 'pipe'] });

let output = ''; // variable for saving the output
let isFirstChunk = true;
let formattedOutput = '';
let boldFormattedOutput = '';


// ======= SUFFIZIENTER CODE ABSCHNITT ========
//
//
child.stdout.on('data', (data) => {


  if (isFirstData) {
      output = data.toString();
      isFirstData = false;

  } else {
      gptOutput += data.toString();
      const userOutput = gptOutput.replace(`${prefix}${text}${suffix}`, '');


      if (isFirstChunk) {
        formattedOutput = `\n\n\u001b[1mYou\u001b[0m\n${text}\n\n\u001b[1mAssistant\u001b[0m\n${userOutput}\n`;
        boldFormattedOutput = `\n\n\u001b[1mYou\n${text}\n\nAssistant\n${userOutput}\u001b[0m\n`;
        isFirstChunk = false;

      } else {
          formattedOutput = `${userOutput}`;
          boldFormattedOutput = `\u001b[1m${userOutput}\u001b[0m`;
      }
    }
  //
// --------------------------------------------





// --------------------------------------------
// visual discremination between concatenated and not concat
//
  if (historyEnabled) {
    let currentContent = outputBox.getContent();
    outputBox.setContent(currentContent + boldFormattedOutput);
  } else {
    let currentContent = outputBox.getContent();
    outputBox.setContent(currentContent + formattedOutput);
  }
  screen.render();
  //
// --------------------------------------------





// --------------------------------------------
//
  // Reset output and gptOutput
  output = '';
  gptOutput = '';
  dialogLog += `${formattedOutput}`;
  collectedOutput += data.toString();
 }
)
//
// --------------------------------------------





// --------------------------------------------
//
// Handle standard error
child.stderr.on('data', (data) => { 
  logRawOutput(data.toString());
 }
)


// Handle standard output as concatenating chat function
if (historyEnabled){
child.stdout.on('data', (data) => {
  catOutputChat(data.toString());
  }
 )
}
  else {
  // ...
}


child.on('error', (error) => {
  outputBox.insertBottom(`Error: ${error.message}`);
  screen.render();
  reject(error);
  }
 )


child.on('close', async (code) => {
  resolve();
  // write the output into chat-file
  const outputPath = path.join(workingdirFolderPath, `complete_logic_${timestamp}.txt`);
  fs.writeFileSync(outputPath, collectedOutput, 'utf8');
});
});
}
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

// findBinFiles(modelsFolder)
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
// function to show interactive cpu usage
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
  }
 )
}
setInterval(updateCpuUsage, 200);
//
// --------------------------------------------





// --------------------------------------------
//
stopLabel.on('click', function(data) {
  if (child) {
    child.kill('SIGINT');
  }
 }
)


sendButton.on('press', () => {
  const text = inputBox.getValue();
  executeCommand(text);
  isFirstChunk = true;
  inputBox.clearValue();
  screen.render();
 }
)


inputBox.on('submit', async () => { 
  const text = inputBox.getValue();
  if (text.trim() !== '') {
    isFirstChunk = true;
    await executeCommand(text);
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


screen.render();
//
// --------------------------------------------
