# Pacha [patʃa] - TUI for Llama.cpp

Pacha is a Text User Interface (TUI) application developed in JavaScript that serves as a frontend for llama.cpp. It provides a simple and convenient way to perform inference using local language models. With Pacha, you can easily select the desired language model, customize prompt styles, and keep track of your notes and thoughts.

![pacha-screenshot-230702.png](https://github.com/mounta11n/Pacha/blob/main/pacha-screenshot-230702.png)



## Features

- **Language Model Selection**: Pacha offers a user-friendly menu for selecting the desired language model.
- **Prompt Style Customization**: Choose from a variety of prompt styles using your keyboard or mouse.
- **Note-Taking**: Keep track of your ideas and notes within Pacha. The current settings and options are saved as well.
- **CPU Usage Indicator**: The top bar of the application changes color based on CPU usage, providing a visual representation.
- **Dialogue and Chat History**: Send individual dialogues or concatenate them to create a chat history.
- **Stop Button**: Halt text generation prematurely with the "Stop" button.
- **Logging**: Pacha maintains logs of executed commands and the raw output from llama.cpp.

## Installation

- **Pre-Release Binaries (v1.0.0)**: Pre-release binaries for Windows, Linux, and macOS are available for download. You can find them in the "Releases" section of this repository.
- **Build from Source**: To build Pacha from source, follow these steps:
  1. Install Node.js and npm (Node Package Manager) if you haven't already.
  2. Navigate to the project directory and run `npm install` to install the required dependencies.
  3. Once the installation is complete, start the application using `node pacha.js`.

Please make sure to place Pacha in the same directory as llama.cpp.

## Usage

To launch Pacha, type `./pacha-yourOS` or `node pacha.js`.
Specify your model or modelpath by using the `-m` flag followed by the path to the directory containing your language models.
If no path is provided, the application will default to searching for `.bin` files in the `./models/` directory.

Example command: `node pacha.js -m /path/to/language/models`

## Planned Features

I have some exciting plans for future enhancements to Pacha, including:

- **Semantic Context with bert.cpp**: Integration of bert.cpp from Gerganov's ggml library to introduce semantic context capabilities.
- **Workspace for Predefined Tests**: A dedicated workspace to facilitate testing of pre-trained language models.
- **Workspace for Training "Baby-Llamas"**: A workspace where users can train their own "baby-llama" from scratch.


[![asciicast](https://asciinema.org/a/594301.svg)](https://asciinema.org/a/594301)


## Contributing

I welcome contributions to improve and enhance Pacha. If you encounter any issues or have suggestions for new features, please submit them in the "Issues" section of this repository. Additionally, feel free to fork this repository and submit pull requests with your proposed changes.

## License

Pacha is released under the [Apache 2.0 License](https://).
