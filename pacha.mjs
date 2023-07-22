import blessed from 'blessed'
// import * as contrib from 'blessed-contrib'

const API_URL = 'http://127.0.0.1:8080'

const chat = [
    {
    },
    // {
    //     human: "Please tell me the largest city in Europe.",
    //     assistant: "Sure. The largest city in Europe is Moscow, the capital of Russia."
    // },
]


const dropDownOptions = [
  'Airoboros',
  'Alpaca',
  'based',
];

let instruction = '';


const screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    ignoreLocked: ['C-c'],
    mouse: true,
   }
)

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



function setInstruction(selectedOption) {
  switch (selectedOption) {
    case 'Airoboros':
      return 'A chat between a curious user and a very friendly ai assistant called "Airo". The assistant will always give true responses. The assistant uses a lot of emojies for every sentence.';
    case 'Alpaca':
      return 'A chat between a curious user and a very friendly ai assistant called "AIpaca". The assistant will always give true responses. The assistant uses a lot of emojies for every sentence.';
      case 'based':
        return 'A chat between a curious user and a very friendly ai assistant called "Baised". The assistant will always give true responses. The assistant uses a lot of emojies for every sentence.';
      default:
        return 'A chat between a curious user and a very friendly ai assistant called "Defai". The assistant will always give true responses. The assistant uses a lot of emojies for every sentence.';
    }
}


dropDown.on('select', (item) => {
  const selectedOption = item.content;
  instruction = setInstruction(selectedOption);
});




function format_prompt(instruction, question) {
  return `${instruction}\n${
    chat.map(m =>`### Human: ${m.human}\n### Assistant: ${m.assistant}`).join("\n")
  }\n### Human: ${question}\n### Assistant:`;
}



async function tokenize(content) {
    const result = await fetch(`${API_URL}/tokenize`, {
        method: 'POST',
        body: JSON.stringify({ content })
    })

    if (!result.ok) {
        return []
    }

    return await result.json().tokens
}

const n_keep = await tokenize(instruction).length

async function chat_completion(instruction, question) {
  const result = await fetch(`${API_URL}/completion`, {
      method: 'POST',
      body: JSON.stringify({
          prompt: format_prompt(instruction, question),
          temperature: 0.2,
          top_k: 40,
          top_p: 0.9,
          n_keep: n_keep,
          n_predict: 256,
          stop: ["\n### Human:"], // stop completion after generating this
          stream: true,
        })
    })

    if (!result.ok) {
        return
    }

    for await (var chunk of result.body) {
        const t = Buffer.from(chunk).toString('utf8');
        if (t.startsWith('data: ')) {
            const message = JSON.parse(t.substring(6));
            
            // Get the current content and append new content
            const newContent = outputBox.getContent() + message.content;  
            outputBox.setContent(newContent);
    
            screen.render();
            if (message.stop) {
                if (message.truncated) {
                    chat.shift();
                }
                break;
            }
        }
    }
}





const inputBox = blessed.textbox({
    top: 0,
    left: 3,
    height: '100%-2',
    width: '85%-4',
    done: () => {},
    keys: true,
    mouse: true,
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

const placeHolderNotes = blessed.box({
  done: () => {},
  top: 1,
  left: 0,
  width: '100%-4',
  height: '100%-4',
  label: 'Placeholder',
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

const placeHolderfileList = blessed.box({
  top: 1,
  left: 0,
  width: '100%-6',
  height: '100%-4',
  label: 'Placeholder',
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
// const dropDownOptions = [
//   'Instruction',
//   'Custom/None',
//   'Airoboros',
//   'Alpaca',
//   'based',
//   'CAMEL Combined',
//   'Chronos',
//   'Gorilla',
//   'GPT4 x Alpaca',
//   'GPT4 x Vicuna',
//   'Guanaco',
//   'Guanaco QLoRA',
//   // 'H2O\'s GPT-GM-OASST1-Falcon 40B v2',
//   'Hippogriff',
//   'Karen The Editor',
//   'Lazarus 30B',
//   'Manticore',
//   'Minotaur',
//   // 'MPT 30B',
//   'Nous Hermes',
//   'OpenAssistant LLaMA',
//   'Orca Mini',
//   'Samantha',
//   'Stable Vicuna',
//   // 'Starchat',
//   'Tulu',
//   'Vicuna V0',
//   'Vicuna V1.1 & V1.3',
//   'Vigogne Chat',
//   'Vigogne Instruct',
//   'WizardLM 7B',
//   'WizardLM 13B & 30B V1.0',
//   'WizardLM 33B V1.0 Uncensored',
//   'WizardVicunaLM',
// ];

// const dropDown = blessed.list({
//   top: 1,
//   left: 0,
//   width: '100%-4',
//   height: '100%-4',
//   label: 'Prompt Style',
//   keys: true,
//   mouse: true,
//   items: dropDownOptions,
//   selected: 'Instruction',
//   border: {
//     type: 'line'
//   },
//   style: {
//     bg: '#555753',
//     fg: '#f5f5f5',
//     label: {
//       bg: '#555753',
//       fg: '#f5f5f5',
//       bold: true,
//       hover: {
//         bg: '#555753',
//         fg: '#8ae234',
//         bold: true,
//       },
//       selected: {
//         bg: '#555753',
//         fg: 'red',
//         bold: true,
//       },
//     },
//     border: {
//       bg: '#555753',
//       fg: '#d3d7cf',
//     },
//     selected: {
//       bg: '#555753',
//       fg: '#8ae234',
//       bold: true,
//     },
//   },
//  }
// )

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


inputBox.on('submit', async (text) => {
  inputBox.clearValue()
  screen.render()

  outputBox.insertBottom(`> ${text}`)

  const response = await chat_completion(instruction, text)
  if (response) {
      outputBox.insertBottom(`Assistant: ${response}\n`)
  }

  screen.render()
})

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
      // fileEtTipFrame.append(fileListRightTooltip);
      // fileEtTipFrame.append(fileListBottomTooltip);
      // fileEtTipFrame.append(fileList);
      fileEtTipFrame.append(placeHolderfileList)

    sidebarLeft.append(dropEtAreaFrame);
      dropEtAreaFrame.append(dropEtTipFrame);
        dropEtTipFrame.append(dropDownRightTooltip);
        dropEtTipFrame.append(dropDownBottomTooltip);
        dropEtTipFrame.append(dropDown);

      dropEtAreaFrame.append(textAreaEtTipFrame);
        // textAreaEtTipFrame.append(textAreaRightTooltip);
        // textAreaEtTipFrame.append(textAreaBottomTooltip);
        // textAreaEtTipFrame.append(textAreaBottom2Tooltip);
        // textAreaEtTipFrame.append(multiNotes);
        // textAreaEtTipFrame.append(multiNotesSaveLabel);
        textAreaEtTipFrame.append(placeHolderNotes)

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

// --------------------------------------------


screen.render();
screen.key(['escape', 'C-c'], (ch, key) => {
    return process.exit(0)
})

screen.render()