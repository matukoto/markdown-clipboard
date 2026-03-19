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
  - `extract.ts` passes the current DOM through `@mozilla/readability` and post-processes the extracted HTML for settings like link/image inclusion
  - `markdown.ts` converts extracted HTML into Markdown with `turndown`
  - `output.ts` formats the final clipboard text and is the extension point for metadata/frontmatter-style output
  - `clip.ts` assembles metadata, extracted HTML, and Markdown into a `ClipResult`
- **Frontend:** Built with Svelte 5. `src/entrypoints/options/App.svelte` is the settings UI for output toggles such as link/image inclusion.
- **Entry Points:**
  - `src/entrypoints/background.ts`: Orchestrates clipping for the active tab and handles the toolbar click, keyboard shortcut, and badge feedback
  - `src/entrypoints/content.ts`: Runs on `http`/`https` pages, extracts the page, formats the clip output, and writes it to the clipboard
  - `src/entrypoints/options/main.ts`: Mounts the options/settings app
- **Manifest/config:** `wxt.config.ts` defines the extension metadata, `tabs`/`storage` permissions, and the `clip-active-tab` command shortcut.

## Key Conventions

- **Formatting/Linting:**
  - Biome is used for formatting and linting. See `biome.jsonc` for settings.
  - Indent style: 2 spaces, LF line endings, double quotes for JS, semicolons always.
- **TDD-first core logic:**
  - Keep clipper behavior in plain TypeScript modules under `src/lib/clip/` and cover them with Vitest before wiring browser APIs.
  - Prefer adding tests around extracted HTML, rendered Markdown, and output formatting rather than around browser APIs.
- **Metadata separation:**
  - `ClipMetadata` / `ClipResult` carry title, URL, and clip timestamp separately from the rendered Markdown.
  - If note-app-specific output is added later, prefer extending `output.ts` instead of mixing formatting into extraction or browser scripts.
- **Svelte:**
  - Svelte components use TypeScript (`lang="ts"`).
  - Keep the options UI thin; browser orchestration belongs in `background.ts` and `content.ts`, not in the component.
- **Testing layout:**
  - Keep extension entrypoint tests under `src/tests/`, not under `src/entrypoints/`, so WXT does not treat `*.test.ts` files as real entrypoints during build.
- **WXT:**
  - `wxt.config.ts` specifies `src` as the source directory, includes the Svelte module, and is the right place for manifest-level permissions and commands.
  - Content-script match patterns are declared in `src/entrypoints/content.ts`, so broadening site coverage should start there.

## Integration with Other AI Assistant Configs

No other AI assistant config files found (Claude, Cursor, Codex, Windsurf, Aider, Cline).

---

This file summarizes build/test/lint commands, architecture, and conventions for Copilot. Would you like to adjust anything or add coverage for areas I may have missed?

If you want to configure MCP servers (e.g., Playwright for web testing), let me know!
