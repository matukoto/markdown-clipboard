import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    default_locale: "en",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["activeTab", "scripting", "storage", "clipboardWrite"],
    action: {
      default_title: "__MSG_actionDefaultTitle__",
    },
    commands: {
      "clip-active-tab": {
        description: "__MSG_commandClipActiveTabDescription__",
        suggested_key: {
          default: "Ctrl+Shift+Y",
          mac: "Command+Shift+Y",
        },
      },
    },
  },
});
