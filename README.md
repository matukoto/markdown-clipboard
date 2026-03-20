# markdown-clipboard

A browser extension that copies the current page to the clipboard as Markdown.

## Highlights

- Converts the active tab into Markdown and copies it
- Can be triggered from the toolbar icon or keyboard shortcut (browser command)
- Lets you toggle how links and images are handled
- Shows success and failure state on the extension badge

## Usage

1. Install the extension
2. Open the page you want to copy
3. Click the toolbar icon or press `Cmd/Ctrl + Shift + Y`
4. The converted content is copied to the clipboard

The copied text starts with `Source: URL`.

## Settings

On the options page, you can toggle:

- Keep links as Markdown links
- Keep images as Markdown images

If both are off, links and images are converted to plain body text as much as possible.

## Development

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` - Start development mode
- `pnpm dev:firefox` - Start Firefox development mode
- `pnpm build` - Build the extension
- `pnpm build:firefox` - Build for Firefox
- `pnpm zip` - Create a distributable zip
- `pnpm lint` - Run static checks
- `pnpm check` - Run Svelte/TypeScript checks
- `pnpm test` - Run tests

## Tech Stack

- WXT + Svelte 5
- TypeScript
- Turndown / turndown-plugin-gfm
- Mozilla Readability
