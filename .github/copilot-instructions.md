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
  - `pnpm test -- src/lib/clip/output.test.ts`
- **CI:**
  - `.github/workflows/ci.yml` runs `lint`, `check`, `test`, `build`, and `build:firefox`

## High-Level Architecture

- **Extension Framework:** Uses [WXT](https://wxt.dev/) for Chrome/Firefox extension development.
- **Clip pipeline:** `src/lib/clip/` contains the core clipper pipeline.
  - `extract.ts` turns DOM content into semantic blocks
  - `markdown.ts` renders those blocks into Markdown
  - `output.ts` formats the final clipboard text and is the extension point for metadata/frontmatter-style output
  - `clip.ts` assembles metadata, extracted blocks, and Markdown into a `ClipResult`
- **Frontend:** Built with Svelte 5. `src/entrypoints/popup/App.svelte` triggers clipping through the background script and previews the copied output.
- **Entry Points:**
  - `src/entrypoints/background.ts`: Orchestrates clipping for the active tab, responds to popup messages, and handles the keyboard shortcut/badge feedback
  - `src/entrypoints/content.ts`: Runs on `http`/`https` pages, extracts the page, formats the clip output, and writes it to the clipboard
  - `src/entrypoints/popup/main.ts`: Mounts Svelte app
- **Manifest/config:** `wxt.config.ts` defines the extension metadata, `tabs` permission, and the `clip-active-tab` command shortcut.

## Key Conventions

- **Formatting/Linting:**
  - Biome is used for formatting and linting. See `biome.jsonc` for settings.
  - Indent style: 2 spaces, LF line endings, double quotes for JS, semicolons always.
- **TDD-first core logic:**
  - Keep clipper behavior in plain TypeScript modules under `src/lib/clip/` and cover them with Vitest before wiring browser APIs.
  - Prefer adding tests around semantic blocks and rendered Markdown rather than testing browser entrypoints directly.
- **Metadata separation:**
  - `ClipMetadata` / `ClipResult` carry title, URL, and clip timestamp separately from the rendered Markdown.
  - If note-app-specific output is added later, prefer extending `output.ts` instead of mixing formatting into extraction or browser scripts.
- **Svelte:**
  - Svelte components use TypeScript (`lang="ts"`).
  - Keep popup UI thin; browser orchestration belongs in `background.ts`, not in the component.
- **WXT:**
  - `wxt.config.ts` specifies `src` as the source directory, includes the Svelte module, and is the right place for manifest-level permissions and commands.
  - Content-script match patterns are declared in `src/entrypoints/content.ts`, so broadening site coverage should start there.

## Integration with Other AI Assistant Configs

No other AI assistant config files found (Claude, Cursor, Codex, Windsurf, Aider, Cline).

---

This file summarizes build/test/lint commands, architecture, and conventions for Copilot. Would you like to adjust anything or add coverage for areas I may have missed?

If you want to configure MCP servers (e.g., Playwright for web testing), let me know!
