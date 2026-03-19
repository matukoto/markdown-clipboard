export type I18nMessageName = Parameters<typeof browser.i18n.getMessage>[0];

export function t(key: I18nMessageName, fallback: string): string {
  const message = browser.i18n.getMessage(key);
  return message === "" ? fallback : message;
}
