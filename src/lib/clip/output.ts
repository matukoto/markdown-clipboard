import type { ClipResult } from "./types";

interface RenderClipOutputOptions {
  includeSource?: boolean;
  includeClippedAt?: boolean;
}

export function renderClipOutput(
  result: Pick<ClipResult, "metadata" | "markdown">,
  {
    includeSource = true,
    includeClippedAt = false,
  }: RenderClipOutputOptions = {}
): string {
  const metadataLines: string[] = [];

  if (includeSource) {
    metadataLines.push(`Source: ${result.metadata.url}`);
  }

  if (includeClippedAt) {
    metadataLines.push(`Clipped at: ${result.metadata.clippedAt}`);
  }

  return [metadataLines.join("\n"), result.markdown]
    .filter((section) => section !== "")
    .join("\n\n")
    .trim();
}
