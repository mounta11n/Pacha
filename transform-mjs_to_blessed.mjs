import blessed from 'blessed'
import * as contrib from 'blessed-contrib'

const API_URL = 'http://127.0.0.1:8080'

const chat = [
    {
        human: "Hello, Assistant.",
        assistant: "Hello. How may I help you today?"
    },
    {
        human: "Please tell me the largest city in Europe.",
        assistant: "Sure. The largest city in Europe is Moscow, the capital of Russia."
    },
]

const instruction = `A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human's questions.`

function format_prompt(question) {
    return `${instruction}\n${
        chat.map(m =>`### Human: ${m.human}\n### Assistant: ${m.assistant}`).join("\n")
    }\n### Human: ${question}\n### Assistant:`
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

async function chat_completion(question) {
    const result = await fetch(`${API_URL}/completion`, {
        method: 'POST',
        body: JSON.stringify({
            prompt: format_prompt(question),
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

// --------------------------------------------

// const screen = blessed.screen()
const screen = blessed.screen({
    smartCSR: true,
    // dockBorders: true,
    fullUnicode: true,
    ignoreLocked: ['C-c'],
   }
  )
const grid = new contrib.grid({ rows: 15, cols: 17, screen: screen })

// --------------------------------------------

const sidebarLeft = grid.set(1, 1, 13, 5, blessed.box, { 
    // label: 'Output', 
    // keys: true,
    // vi: true,
    // mouse: true,
    // alwaysScroll: true, 
    // scrollable: true, 
    // scrollbar: { ch: ' ' }
})
// --------------------------------------------

const sidebarRight = grid.set(1, 11, 13, 5, blessed.box, { 
    // label: 'Output', 
    // keys: true,
    // vi: true,
    // mouse: true,
    // alwaysScroll: true, 
    // scrollable: true, 
    // scrollbar: { ch: ' ' }
})

// --------------------------------------------

const outputBox = grid.set(1, 6, 10, 5, blessed.box, { 
    label: 'Output', 
    keys: true,
    vi: true,
    mouse: true,
    alwaysScroll: true, 
    scrollable: true, 
    scrollbar: { ch: ' ' }
})

// --------------------------------------------

const inputBox = grid.set(11, 6, 2, 5, blessed.textbox, { 
    label: 'Input',
    inputOnFocus: true, 
    keys: true, 
    vi: true,
    mouse: true
})


const negativeBox = grid.set(13, 6, 1, 5, blessed.textbox, { 
    label: 'Negative Prompt',
    inputOnFocus: true, 
    keys: true, 
    vi: true,
    mouse: true
})


const tempBox = grid.set(11.5, 1, 1, 4, blessed.textbox, { 
    label: 'Temp',
    inputOnFocus: true, 
    keys: true, 
    vi: true,
    mouse: true
})

const n_predictBox = grid.set(11.5, 6, 1, 4, blessed.textbox, { 
    label: 'n_prdct',
    inputOnFocus: true, 
    keys: true, 
    vi: true,
    mouse: true
})

const advancedBox = grid.set(12.5, 1, 1, 9, blessed.textbox, { 
    label: 'advncd',
    inputOnFocus: true, 
    keys: true, 
    vi: true,
    mouse: true
})

// --------------------------------------------

inputBox.on('submit', async (text) => {
    inputBox.clearValue()
    screen.render()

    outputBox.insertBottom(`> ${text}`)

    const response = await chat_completion(text)
    if (response) {
        outputBox.insertBottom(`Assistant: ${response}\n`)
    }

    screen.render()
})

// --------------------------------------------

screen.append(sidebarLeft)
screen.append(sidebarRight)
    sidebarRight.append(tempBox)
    sidebarRight.append(n_predictBox)
    sidebarRight.append(advancedBox)
screen.append(outputBox)
screen.append(inputBox)
screen.append(negativeBox)

// --------------------------------------------

inputBox.focus()

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0)
})

screen.render()