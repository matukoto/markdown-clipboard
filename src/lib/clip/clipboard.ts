export async function writeTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText !== undefined) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      const clipboardMessage =
        error instanceof Error ? error.message : "Unknown clipboard error.";

      try {
        copyWithExecCommand(text);
        return;
      } catch (fallbackError) {
        const fallbackMessage =
          fallbackError instanceof Error
            ? fallbackError.message
            : "Unknown fallback clipboard error.";

        throw new Error(
          `Clipboard API failed: ${clipboardMessage}; fallback copy failed: ${fallbackMessage}`
        );
      }
    }
  }

  copyWithExecCommand(text);
}

function copyWithExecCommand(text: string): void {
  const body = document.body;

  if (body === null) {
    throw new Error("Document body is unavailable for clipboard fallback.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";

  body.append(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("execCommand copy failed.");
  }
}
