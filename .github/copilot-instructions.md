# Copilot Instructions for markdown-clipboard

## Build, Test, and Lint Commands

- **Build:**
  - `pnpm build` or `npm run build` (for Chrome)
  - `npm run build:firefox` (for Firefox)
- **Development:**
  - `pnpm dev` or `npm run dev` (for Chrome)
  - `npm run dev:firefox` (for Firefox)
- **Lint:**
  - `pnpm lint` or `npm run lint`
  - `pnpm check` or `npm run check` (runs svelte-check)
- **Test:**
  - `pnpm test` or `npm run test`
- **Single Test:**
  - `pnpm test -- src/lib/clip/text.test.ts`

## High-Level Architecture

- **Extension Framework:** Uses [WXT](https://wxt.dev/) for Chrome/Firefox extension development.
- **Frontend:** Built with Svelte 5. Main UI is in `src/entrypoints/popup/App.svelte`.
- **Entry Points:**
  - `src/entrypoints/background.ts`: Background script
  - `src/entrypoints/content.ts`: Content script (currently matches Google)
  - `src/entrypoints/popup/main.ts`: Mounts Svelte app
- **Current State:** The popup, background script, and content script still contain starter/sample behavior; production clipper logic has not been wired yet.

## Key Conventions

- **Formatting/Linting:**
  - Biome is used for formatting and linting. See `biome.jsonc` for settings.
  - Indent style: 2 spaces, LF line endings, double quotes for JS, semicolons always.
- **Svelte:**
  - Svelte components use TypeScript (`lang="ts"`).
  - Main app entry is `App.svelte` mounted in `main.ts`.
- **WXT:**
  - `wxt.config.ts` specifies `src` as the source directory and includes Svelte module.

## Integration with Other AI Assistant Configs

No other AI assistant config files found (Claude, Cursor, Codex, Windsurf, Aider, Cline).

---

This file summarizes build/test/lint commands, architecture, and conventions for Copilot. Would you like to adjust anything or add coverage for areas I may have missed?

If you want to configure MCP servers (e.g., Playwright for web testing), let me know!
