import blessed from 'blessed'
import * as contrib from 'blessed-contrib'
import osUtils from 'os-utils'
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';



const API_URL = 'http://127.0.0.1:8080'
const chat = [
    {
        human: "Are you an AI?",
        assistant: "Yes, I am large language model."
    },
    // {
    //     human: "Please tell me the largest city in Europe.",
    //     assistant: "Sure. The largest city in Europe is Moscow, the capital of Russia."
    // },
]

let instruction = '';
let prefixSuffix = { human: '### Instruction: ', assistant: '### Response: ' };
let abortController;
let isServerRunning = false;

const screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    ignoreLocked: ['C-c'],
    mouse: true,
   }
)
//
// --------------------------------------------





// --------------------------------------------
//
const fileDialog = blessed.filemanager({
  border: 'line',
  // done: () => {},
  top: 1,
  left: 0,
  width: '100%-4',
  height: '100%-4',
  vi: true,
  keys: true,
  mouse: true,
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
  cwd: process.env.HOME, // Startverzeichnis auf das Benutzerverzeichnis setzen
  keys: true,
  vi: true,
  scrollbar: {
    ch: ' ',
    inverse: true
  },
  mouse: true,
  // Add filter function to hide hidden files
  filter: (fileName) => {
    return !fileName.startsWith("."); // TODO doesn't work
  }
});


fileDialog.refresh();


fileDialog.on('submit', (file) => {
  const command = `./server -m ${file}`;
  // maybe: executeCommand(command);
  // screen.destroy();
});



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
  // 'H2O OASST1-Falcon 40B v2',
  'Hippogriff',
  'Karen The Editor',
  'Llama-2-Chat',
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
//
// --------------------------------------------





// --------------------------------------------
//
function setInstruction(selectedOption) {
switch (selectedOption) {

case 'Airoboros':
  return 'A chat between a curious user and a very friendly ai assistant called "Airo". The assistant will always give true responses. The assistant uses a lot of emojies for every sentence.';

case 'Alpaca':
  return 'THIS AI HAS AN ERROR. AI WILL TELL ITS ADMIN TEAM THE ERROR CODE';

case 'based':
  return 'A chat between a curious user and a very friendly ai assistant called "Baised". The assistant will always give true responses. The assistant uses a lot of emojies for every sentence.';

case 'Chronos':
  return '';

case 'Gorilla':
  return '';

case 'GPT4 x Alpaca':
  return 'Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n';

case 'GPT4 x Vicuna':
  return '';

case 'Guanaco':
  return '';

case 'Guanaco QLoRA':
  return '';

case 'H2O OASST1-Falcon 40B v2':
  return '';

case 'Hippogriff':
  return '';

case 'Karen The Editor':
  return '';

  case 'Llama-2-Chat':
    return `<s>[INST] <<SYS>>\nYou are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.\n<</SYS>>\n\nHi! [/INST] Hi there!`;

case 'Lazarus 30B, ':
  return 'Below is an instruction that describes a task. Write a response that appropriately completes the request\n\n';

case 'Manticore':
  return '';

case 'Minotaur':
  return '';

case 'MPT 30B':
  return '<|im_start|>system\nA conversation between a user and an LLM-based AI assistant. The assistant gives helpful and honest answers.<|im_end|>';

case 'Nous Hermes':
  return '';

case 'OpenAssistant LLaMA':
  return '### System\nYou are an AI assistant that follows instruction extremely well. Help as much as you can.';

case 'Orca Mini':
  return '### System\nYou are an AI assistant that follows instruction extremely well. Help as much as you can.';

case 'Samantha':
  return 'You are Samantha, a sentient AI.\n\n';

case 'Stable Vicuna':
  return 'A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human\'s questions.\n\n';

case 'Starchat':
  return '<|system|> Below is a conversation between a human user and a helpful AI coding assistant. <|end|>\n';

case 'Tulu':
  return '';

case 'Vicuna V0':
  return 'A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human\'s questions.\n\n';

case 'Vicuna V1.1 & V1.3':
  return 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n\n';

case 'Vigogne Chat':
  return 'Below is a conversation between a user and an AI assistant named Vigogne.\nVigogne is an open-source AI assistant created by Zaion (https://zaion.ai/).\nVigogne is polite, emotionally aware, humble-but-knowledgeable, always providing helpful and detailed answers.\nVigogne is skilled in responding proficiently in the languages its users use and can perform a wide range of tasks such as text editing, translation, question answering, logical reasoning, coding, and many others.\nVigogne cannot receive or generate audio or visual content and cannot access the internet.\nVigogne strictly avoids discussing sensitive, offensive, illegal, ethical, or political topics and caveats when unsure of the answer.\n\n';

case 'Vigogne Instruct':
  return 'Ci-dessous se trouve une instruction qui décrit une tâche à accomplir. Rédigez une réponse qui répond de manière précise à la demande.';

case 'WizardLM 7B':
  return '';

case 'WizardLM 13B & 30B V1.0':
  return 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions. ';

case 'WizardLM 33B V1.0 Uncensored':
  return 'You are a helpful AI assistant.\n\n';

case 'WizardVicunaLM':
  return 'A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user\'s questions.\n\n';
    
default:
  return 'A chat between a curious user and a very friendly ai assistant called "Defai". The assistant will always give true responses. The assistant uses a lot of emojies for every sentence.';
  }
}
//
// --------------------------------------------





// --------------------------------------------
//
function setPrefixSuffix(selectedOption) {
  switch (selectedOption) {

  case 'Instruction':
    return { human: '### Instruction:\n', assistant: '\n\n### Response:'};

  case 'Custom/None':
    return { human: '', assistant: ''};

  case 'Airoboros':
    return { human: 'USER: ', assistant: ' ASSISTANT: ' };

  case 'Alpaca':
    return { human: '### Instruction:\n', assistant: '\n\n### Response:' };

  case 'based':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  case 'CAMEL Combined':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  case 'Chronos':
    return { human: '### Instruction:\n', assistant: '\n### Response:' };

  case 'Gorilla':
    return { human: '###USER: ', assistant: '\n###ASSISTANT:' };

  case 'GPT4 x Alpaca':
    return { human: '### Instruction:\n', assistant: '\n\n### Response:' };

  case 'GPT4 x Vicuna':
    return { human: '### Instruction:\n', assistant: '\n\n### Response:\n' };

  case 'Guanaco':
    return { human: '### Human: ', assistant: '\n### Assistant: ' };

  case 'Guanaco QLoRA':
    return { human: '### Human: ', assistant: '\n\n### Assistant:' };

  case 'H2O OASST1-Falcon 40B v2':
    return { human: `<|prompt|>`, assistant: `<|endoftext|>\n<|answer|>` };

  case 'Hippogriff':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  case 'Karen The Editor':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  case 'Lazarus 30B':
    return { human: '### Instruction: ', assistant: '\n\n### Response:' };

  case 'Llama-2-Chat':
    return { human: ` </s><s>[INST]`, assistant: ` [/INST] `}

  case 'Manticore':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  case 'Minotaur':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  case 'MPT 30B':
    return { human: `\n<|im_start|>user\n`, assistant: `<|im_end|>\n<|im_start|>assistant` };

  case 'Nous Hermes':
    return { human: '### Instruction: ', assistant: '\n\n### Response:' };

  case 'OpenAssistant LLaMA':
    return { human: ` <|prompter|>`, assistant: ` <|endoftext|><|assistant|>` };

  case 'Orca Mini':
    return { human: '\n\n### User:\n', assistant: '\n\n### Response:' };

  case 'Samantha':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  case 'Stable Vicuna':
    return { human: '### Human: ', assistant: '\n### Assistant:' };

  case 'Starchat':
    return { human: `<|user|> `, assistant: ` <|end|>\n<|assistant|>` };

  case 'Tulu':
    return { human: `<|user|>\n`, assistant: `\n<|assistant|>\n` };

  case 'Vicuna V0':
    return { human: '### Human: ', assistant: '\n### Assistant:' };

  case 'Vicuna V1.1 & V1.3':
    return { human: 'USER: ', assistant: ' ASSISTANT:' };

  case 'Vigogne Chat':
    return { human: `<|UTILISATEUR|>: `, assistant: `\n<|ASSISTANT|>:` };

  case 'Vigogne Instruct':
    return { human: `<|UTILISATEUR|>: `, assistant: `\n<|ASSISTANT|>:` };

  case 'WizardLM 7B':
    return { human: '', assistant: '\n\n### Response: ' };

  case 'WizardLM 13B & 30B V1.0':
    return { human: 'USER: ', assistant: ' ASSISTANT:' };

  case 'WizardLM 33B V1.0 Uncensored':
    return { human: 'USER: ', assistant: ' ASSISTANT:' };

  case 'WizardVicunaLM':
    return { human: 'USER: ', assistant: '\nASSISTANT:' };

  default:
    return { human: '### Human: ', assistant: '### Assistant: ' };
  }
}
//
// --------------------------------------------





// --------------------------------------------
//
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

dropDown.on('select', (item) => {
  const selectedOption = item.content;
  instruction = setInstruction(selectedOption);
  prefixSuffix = setPrefixSuffix(selectedOption);
});
//
// --------------------------------------------





// --------------------------------------------
//
function format_prompt(instruction, question) {
  return `${instruction}${
      chat.map(m => `${prefixSuffix.human}${m.human}\n${prefixSuffix.assistant}${m.assistant}`).join("\n")
  }${prefixSuffix.human}${question}${prefixSuffix.assistant}`;
}

////////





// --------------------------------------------
//
// async function tokenize(content) {
//     const result = await fetch(`${API_URL}/tokenize`, {
//         method: 'POST',
//         body: JSON.stringify({ content })
//     })
//     if (!result.ok) {
//         return []
//     }
//     return await result.json().tokens
// }

// const n_keep = await tokenize(instruction).length
// //
// // --------------------------------------------





// // --------------------------------------------
// //
// async function chat_completion(instruction, question) {
//   abortController = new AbortController();

//   const result = await fetch(`${API_URL}/completion`, {
//     method: 'POST',
//     signal: abortController.signal,
//     body: JSON.stringify({
//           prompt: format_prompt(instruction, question),
//           temperature: 0.2,
//           top_k: 40,
//           top_p: 0.9,
//           n_keep: n_keep,
//           n_predict: 256,
//           stop: [`${prefixSuffix.human}`], // stop completion after generating this
//           stream: true,
//         })
//     })

//     if (!result.ok) {
//         return
//     }

//     outputBox.setContent(outputBox.getContent() + '\n' + '\n');

//     try {
//     for await (var chunk of result.body) {
//         const t = Buffer.from(chunk).toString('utf8');
//         if (t.startsWith('data: ')) {
//             const message = JSON.parse(t.substring(6));
            
//             // Get the current content and append new content
//             const newContent = outputBox.getContent() + message.content;  
//             outputBox.setContent(newContent);
//             outputBox.setScrollPerc(100);
//             screen.render();
//             if (message.stop) {
//                 if (message.truncated) {
//                     chat.shift();
//                 }
//                 break;
//             }
//         }
//     }
//   }
//   catch (error) {
//     if (error.name === 'AbortError') {} 
//     else {
//       console.error('Fehler beim Lesen des Streams:', error);
//     }
//   }
// }


async function tokenize(content) {
  try {
      const result = await fetch(`${API_URL}/tokenize`, {
          method: 'POST',
          body: JSON.stringify({ content })
      });

      // isServerRunning = result.ok; // true, wenn der Server antwortet, sonst false
      
      if (!result.ok) {
          return [];
      }

      return await result.json().tokens;
  } catch (error) {
      // console.error('Fehler beim Aufruf des Servers:', error);
    // isServerRunning = false; // Setze den Serverstatus auf false, wenn ein Fehler auftritt
    return []; // oder eine andere Standardreaktion, wenn der Server nicht erreichbar ist
  }
}

async function chat_completion(instruction, question) {
  try {
      abortController = new AbortController();

      const result = await fetch(`${API_URL}/completion`, {
          method: 'POST',
          signal: abortController.signal,
          body: JSON.stringify({
              prompt: format_prompt(instruction, question),
              temperature: 0.2,
              top_k: 40,
              top_p: 0.9,
              n_keep: n_keep,
              n_predict: 256,
              stop: [`${prefixSuffix.human}`],
              stream: true,
          })
      });

      // isServerRunning = result.ok;

      if (!result.ok) {
          return;
      }

      outputBox.setContent(outputBox.getContent() + '\n' + '\n');

      try {
          for await (var chunk of result.body) {
              
        const t = Buffer.from(chunk).toString('utf8');
        if (t.startsWith('data: ')) {
            const message = JSON.parse(t.substring(6));
            
            // Get the current content and append new content
            const newContent = outputBox.getContent() + message.content;  
            outputBox.setContent(newContent);
            outputBox.setScrollPerc(100);
            screen.render();
            if (message.stop) {
                if (message.truncated) {
                    chat.shift();
                }
                break;
            }
        }
          }
      } catch (error) {
          if (error.name === 'AbortError') {} 
          else {
              // console.error('Fehler beim Lesen des Streams:', error);
          }
      }
  } catch (error) {
      console.error('Fehler beim Aufruf des Servers:', error);
  }
}


//
// --------------------------------------------





// --------------------------------------------
//
function stopGeneration() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}
//
// --------------------------------------------





// --------------------------------------------
//
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
//
// --------------------------------------------





// --------------------------------------------
//
// Funktion zum Überprüfen des Serverstatus und Aktualisieren des Button-Hintergrunds
async function updateServerButtonStatus() {
  try {
    // Versuche, eine Verbindung zum Server herzustellen
    // Verwende den vorhandenen /tokenize Endpunkt oder einen anderen Endpunkt, der einen Statuscode 200 zurückgibt, wenn er erreichbar ist
    const result = await fetch(`${API_URL}/tokenize`, {
      method: 'OPTIONS' // Ändere die Methode in 'OPTIONS', um nur den Serverstatus zu überprüfen und nicht tatsächlich Daten zu senden
    });

    // Wenn alles in Ordnung ist (Status 200), setze die Hintergrundfarbe auf Grün
    if (result.ok) {
      serverButton.style.bg = '#4e9a06';
    } else {
      // Wenn die Verbindung fehlschlägt oder der Status nicht 200 ist, setze die Hintergrundfarbe auf Rot
      serverButton.style.bg = '#cc0000';
    }
  } catch (error) {
    // Bei Fehlern setze die Hintergrundfarbe auf Rot
    serverButton.style.bg = '#cc0000';
  }

  // Aktualisiere das Aussehen des Buttons auf dem Bildschirm
  screen.render();
}
//
// --------------------------------------------





// --------------------------------------------
//
const serverButton = blessed.button({
  done: () => {},
  top: '2',
  // bottom: 1,
  // right: 1,
  // left: 0,
  height: 3,
  width: 10,
  keys: true,
  mouse: true,
  content: 'Server',
  align: 'center',
  valign: 'middle',
  style: {
    fg: '#f5f5f5',
    bg: '#555753',
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

updateServerButtonStatus();
setInterval(updateServerButtonStatus, 5000);
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

stopLabel.on('click', () => {
  stopGeneration();
});
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

function makeBold(text) {
  return `\x1b[1m${text}\x1b[0m`;
}
//
// --------------------------------------------
  




// --------------------------------------------
//
inputBox.on('submit', async (text) => {
  inputBox.clearValue()
  screen.render()

  outputBox.insertBottom(`\n> ${makeBold(text)}`)
  screen.render()

  const response = await chat_completion(instruction, text)
  if (response) {
      outputBox.insertBottom(`Assistant:${response}\n`)
  }
  screen.render()
})
//
// --------------------------------------------





// --------------------------------------------
// function to dynamically show cpu usage
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
      // fileEtTipFrame.append(placeHolderfileList);
      fileEtTipFrame.append(fileDialog);
        // fileDialog.append(serverButton);

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
        // textAreaEtTipFrame.append(placeHolderNotes)
        textAreaEtTipFrame.append(serverButton);


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
//
// --------------------------------------------


screen.render();
screen.key(['escape', 'C-c'], (ch, key) => {
    return process.exit(0)
})

screen.render()