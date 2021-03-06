# phaserquest
A first attempt at making a well-structured typescript, webpacked dev setup for a Phaser js project

## Setup
Make sure you have [Node, NPM](https://nodejs.org/en/download/), and [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable) installed.

Run "yarn" in the command line to install dependencies.

To make use of the auto code formatting config and typescript intellisense in this project:
- Download Visual Studio Code: https://code.visualstudio.com/
- Install the "Prettier - Code Formatter" extension
- Install the "ESLint" extension
- add these settings to VSCode (file->preferences->settings)

    "editor.formatOnSave": true,
    "eslint.run": "onSave",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true,
    },
    "eslint.validate": [
        "javascript",
        "typescript"
    ]

## Running project
Run "yarn dev" or "yarn start" to compile with webpack and start a webpack server. Open "localhost:8080" in your browser to load the game.

Run "yarn build" to output a production build as dist/phaserquest.zip.
