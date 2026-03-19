# Markdown Web Clipper

## Project Overview

Markdown Web Clipper is a browser extension that allows users to extract the main content of a web page and convert it into clean Markdown format, automatically saving it to the system's clipboard. 

The extension works entirely locally within the browser, avoiding any third-party APIs for privacy and security. It utilizes a modular architecture to cleanly separate DOM extraction, Markdown conversion, and clipboard interactions.

### Tech Stack
- **Extension Framework:** WXT (Next-gen framework for browser extensions)
- **UI Framework:** Svelte
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Testing:** Vitest, jsdom
- **Linting & Formatting:** Biome

### Architecture
- **`src/entrypoints/`**: Contains the entry points for the extension, including background scripts (`background.ts`), content scripts (`content.ts`), and the popup UI built with Svelte (`popup/`).
- **`src/lib/clip/`**: Houses the core business logic.
  - `extract.ts`: Extracts the main content from the DOM while excluding noise like navbars, footers, and ads.
  - `markdown.ts`: Converts the extracted HTML elements into Markdown syntax.
  - `clipboard.ts`: Handles writing the converted text to the system clipboard.
  - `text.ts`, `messages.ts`, `types.ts`: Support utilities, messaging configurations, and types.

## Building and Running

This project uses `pnpm` as the package manager and `wxt` for managing the extension development lifecycle.

### Installation
```bash
pnpm install
```

### Development
Start the development server with Hot Module Replacement (HMR). This will launch a new browser instance with the extension loaded automatically.
```bash
# For Chrome (Default)
pnpm dev

# For Firefox
pnpm dev:firefox
```

### Building
Compile the extension for production use.
```bash
# For Chrome
pnpm build

# For Firefox
pnpm build:firefox
```

### Packaging
Package the built extension into a `.zip` file for Chrome Web Store / Firefox Add-ons distribution.
```bash
# For Chrome
pnpm zip

# For Firefox
pnpm zip:firefox
```

### Testing and Type Checking
```bash
# Run unit tests using Vitest
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run TypeScript checks for Svelte and TS files
pnpm check
```

## Development Conventions

### Code Style & Formatting
The project uses **Biome** for code formatting and linting, configured via `biome.jsonc`. Ensure your editor is configured to format using Biome on save.

**Formatting Rules:**
- Indentation: 2 spaces.
- Line endings: LF.
- JavaScript/TypeScript: Double quotes, mandatory semicolons, and trailing commas (ES5 style).
- HTML/Svelte formatting is enabled with script and style indentation.

**Linting Rules:**
- Recommended rules are enabled.
- Unused variables throw an error (`"noUnusedVariables": "error"`).
- Unused imports throw a warning (`"noUnusedImports": "warn"`).

To run the linter manually:
```bash
pnpm lint
```

### Testing Practices
- The project uses **Vitest** for testing, with tests residing alongside the source code in `.test.ts` files (e.g., `src/lib/clip/clip.test.ts`).
- New features or bug fixes in the extraction or markdown conversion logic must be accompanied by relevant unit tests.
- `jsdom` is utilized for testing DOM-related logic outside the actual browser environment.
