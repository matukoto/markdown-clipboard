import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "Markdown Web Clipper",
    description:
      "Extract the main content of the current page, convert it to Markdown, and copy it to the clipboard.",
    permissions: ["tabs", "storage"],
    action: {
      default_title: "Markdown Web Clipper",
    },
    commands: {
      "clip-active-tab": {
        description: "Copy the current page as Markdown",
        suggested_key: {
          default: "Ctrl+Shift+Y",
          mac: "Command+Shift+Y",
        },
      },
    },
  },
});
