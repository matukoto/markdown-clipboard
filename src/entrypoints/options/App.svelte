<script lang="ts">
  import { onMount } from "svelte";
  import { isInstanceOf } from "unknownutil";
  import {
    getClipContentOptions,
    setClipContentOptions,
  } from "../../lib/clip/settings";

  type I18nMessageName = Parameters<typeof browser.i18n.getMessage>[0];

  function t(key: I18nMessageName, fallback: string): string {
    const message = browser.i18n.getMessage(key);
    return message === "" ? fallback : message;
  }

  let includeLinks = $state(false);
  let includeImages = $state(false);
  let isLoading = $state(true);
  let statusMessage = $state("");
  let errorMessage = $state("");

  onMount(async () => {
    try {
      const options = await getClipContentOptions();
      includeLinks = options.includeLinks;
      includeImages = options.includeImages;
    } catch (error) {
      errorMessage = isInstanceOf(Error)(error)
        ? error.message
        : t("optionsLoadFailed", "Failed to load settings.");
    } finally {
      isLoading = false;
    }
  });

  async function saveSettings() {
    statusMessage = "";
    errorMessage = "";

    try {
      const next = await setClipContentOptions({
        includeLinks,
        includeImages,
      });
      includeLinks = next.includeLinks;
      includeImages = next.includeImages;
      statusMessage = t("optionsSaveSuccess", "Settings saved.");
    } catch (error) {
      errorMessage = isInstanceOf(Error)(error)
        ? error.message
        : t("optionsSaveFailed", "Failed to save settings.");
    }
  }

  function handleIncludeLinksChange(event: Event) {
    if (!isInstanceOf(HTMLInputElement)(event.currentTarget)) return;
    includeLinks = event.currentTarget.checked;
    void saveSettings();
  }

  function handleIncludeImagesChange(event: Event) {
    if (!isInstanceOf(HTMLInputElement)(event.currentTarget)) return;
    includeImages = event.currentTarget.checked;
    void saveSettings();
  }
</script>

<main class="page">
  <header class="hero">
    <p class="eyebrow">{t("optionsEyebrow", "Markdown Web Clipper")}</p>
    <h1>{t("optionsHeading", "Settings")}</h1>
    <p class="description">
      {t(
        "optionsDescription",
        "Click the extension icon or use the shortcut to copy the current page as Markdown. On this page, you can change the clip output options."
      )}
    </p>
  </header>

  <section
    class="card"
    aria-label={t("optionsClipSettingsAriaLabel", "Clip settings")}
  >
    <h2>{t("optionsCopySettingsHeading", "Copy settings")}</h2>

    <label class="toggle">
      <input
        type="checkbox"
        checked={includeLinks}
        onchange={handleIncludeLinksChange}
        disabled={isLoading}
      >
      <span
        >{t("optionsIncludeLinksLabel", "Keep links as Markdown links")}</span
      >
    </label>

    <label class="toggle">
      <input
        type="checkbox"
        checked={includeImages}
        onchange={handleIncludeImagesChange}
        disabled={isLoading}
      >
      <span
        >{t("optionsIncludeImagesLabel", "Keep images as Markdown images")}</span
      >
    </label>

    <p class="hint">
      {t(
        "optionsHint",
        "If both are off, links and images are converted to plain body text as much as possible."
      )}
    </p>
  </section>

  <section class="card" aria-label={t("optionsHowToAriaLabel", "How to use")}>
    <h2>{t("optionsHowToHeading", "How to use")}</h2>
    <ul>
      <li>
        {t(
          "optionsHowToClickIcon",
          "Click the extension icon in the toolbar to copy the current page."
        )}
      </li>
      <li>
        {t("optionsHowToShortcutLead", "Shortcut:")}
        {" "}
        <code>Cmd/Ctrl + Shift + Y</code>
        {t("optionsHowToShortcutTail", ".")}
      </li>
      <li>
        {t("optionsHowToSourceLead", "Copied text starts with")}
        {" "}
        <code>Source: URL</code>
        {t("optionsHowToSourceTail", ".")}
      </li>
    </ul>
  </section>

  {#if statusMessage !== ""}
    <p class="status success">{statusMessage}</p>
  {/if}

  {#if errorMessage !== ""}
    <p class="status error">{errorMessage}</p>
  {/if}
</main>

<style>
  .page {
    max-width: 720px;
    margin: 0 auto;
    display: grid;
    gap: 1rem;
  }

  .hero,
  .card {
    display: grid;
    gap: 0.75rem;
  }

  .eyebrow,
  .description,
  .hint,
  .status {
    margin: 0;
  }

  .eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #2563eb;
  }

  h1,
  h2 {
    margin: 0;
    color: #0f172a;
  }

  h1 {
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    font-size: 1.05rem;
  }

  .description,
  .hint,
  li {
    color: #475569;
  }

  .card {
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1rem;
    background: white;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: #0f172a;
  }

  .toggle input {
    width: 1rem;
    height: 1rem;
    accent-color: #2563eb;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.5rem;
  }

  .status {
    border-radius: 0.75rem;
    padding: 0.75rem 0.9rem;
    font-size: 0.95rem;
  }

  .status.success {
    background: #dcfce7;
    color: #166534;
  }

  .status.error {
    background: #fee2e2;
    color: #991b1b;
  }
</style>
