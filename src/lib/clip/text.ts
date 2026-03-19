export function collapseWhitespace(input: string): string {
  return input.replace(/\s+/g, " ");
}

export function normalizeText(input: string): string {
  return collapseWhitespace(input).trim();
}
