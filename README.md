# CopyCatTaurifying

A fun, cat-themed desktop application built with [Tauri](https://tauri.app/) to copy and manage text snippets with a playful interface. CopyCatTaurifying lets you store, organize, and retrieve text snippets while enjoying animated cat visuals that mimic your actions, making clipboard management a delightful experience.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Clipboard Management**: Save, categorize, and retrieve text snippets with ease.
- **Cat-Themed Animations**: Enjoy animated cat visuals that react to your copy/paste actions.
- **Cross-Platform**: Built with Tauri, supporting Windows, macOS, and Linux.
- **Lightweight**: Minimal resource usage thanks to Tauri's Rust-based backend. 

## Installation

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Prasannajaga/copy-cat-taurifying.git
   cd copy-cat-taurifying
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build and Run**:
   - For development:
     ```bash
     npm run tauri dev
     ```
   - For production:
     ```bash
     npm run tauri build
     ```

4. **Notes**:
   - On macOS, you may need to allow the app in `System Preferences > Security & Privacy > General` due to unsigned binaries.
   - On Windows, ensure `WebView2` is installed (included in recent Windows versions).

## Usage
1. Launch the app using `npm run tauri dev` or by running the built executable.
2. Copy text from any application, and the app will automatically detect and store it.
3. Use the interface to:
   - View saved snippets in categories (e.g., Code, Notes, URLs).
   - Search for snippets using keywords.
   - Enjoy cat animations that mimic your actions (e.g., a cat "typing" when you copy code). 

### Example
- Copy a code snippet: `console.log("Hello, World!");`
- The app displays a cat swiping at the text, then saves it under the "Code" category.
- Retrieve it later by searching "Hello" or browsing the category. 

## Contributing
We welcome contributions to make CopyCatTaurifying even more pawsome! To contribute:

1. **Fork the Repository**: Create a fork on GitHub.
2. **Clone and Set Up**:
   ```bash
   git clone https://github.com/<your-username>/copy-cat-taurifying.git
   cd copy-cat-taurifying
   npm install
   ```
3. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
4. **Make Changes**: Add features, fix bugs, or improve documentation.
5. **Test**: Ensure your changes work with `npm run tauri dev`.
6. **Submit a Pull Request**: Push your branch and create a pull request with a clear description. ensure your code adheres to the project’s style guidelines. For bug reports or feature requests, open an issue on the [GitHub repository](https://github.com/Prasannajaga/copy-cat-taurifying/issues). 
---

Made with ❤️ by the [@Prasanna](https://github.com/Prasannajaga).