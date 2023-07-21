import blessed from 'blessed'
import * as contrib from 'blessed-contrib'
import { stdin, stdout } from 'node:process'

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

// async function chat_completion(question) {
//     const result = await fetch(`${API_URL}/completion`, {
//         method: 'POST',
//         body: JSON.stringify({
//             prompt: format_prompt(question),
//             temperature: 0.2,
//             top_k: 40,
//             top_p: 0.9,
//             n_keep: n_keep,
//             n_predict: 256,
//             stop: ["\n### Human:"], // stop completion after generating this
//             stream: true,
//         })
//     })

//     if (!result.ok) {
//         return
//     }

//     let answer = ''

//     for await (var chunk of result.body) {
//         const t = Buffer.from(chunk).toString('utf8')
//         if (t.startsWith('data: ')) {
//             const message = JSON.parse(t.substring(6))
//             answer += message.content
//             if (message.stop) {
//                 if (message.truncated) {
//                     chat.shift()
//                 }
//                 break
//             }
//         }
//     }

//     return answer.trimStart()
// }
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


const screen = blessed.screen()
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

const outputBox = grid.set(0, 0, 9, 12, blessed.box, { 
    label: 'Output', 
    keys: true,
    vi: true, 
    alwaysScroll: true, 
    scrollable: true, 
    scrollbar: { ch: ' ' }
})

const inputBox = grid.set(9, 0, 3, 12, blessed.textbox, { 
    label: 'Input',
    inputOnFocus: true, 
    keys: true, 
    vi: true,
    mouse: true
})

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

screen.append(outputBox)
screen.append(inputBox)

inputBox.focus()

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0)
})

screen.render()