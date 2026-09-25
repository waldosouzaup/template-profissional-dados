// Addresses typed in the admin or written in Markdown only become links when they point to the web,
// an e-mail, a phone or this site: "javascript:" and similar schemes never reach an href.
// No dependencies: the Netlify edge function (Deno) imports it too.

// Browsers skip control characters and spaces while reading a scheme ("java\tscript:" runs as "javascript:").
// eslint-disable-next-line no-control-regex
const IGNORED_BY_BROWSERS = /[\u0000- \u007f-\u009f]/g;
const SCHEME = /^([a-z][a-z0-9+.-]*):/i;
const ALLOWED_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

// The address as typed when it is safe to link to, otherwise undefined. Relative addresses are allowed.
export const safeUrl = (url?: string | null): string | undefined => {
  const value = url?.trim();
  if (!value) return undefined;
  const scheme = SCHEME.exec(value.replace(IGNORED_BY_BROWSERS, ""))?.[1].toLowerCase();
  return !scheme || ALLOWED_SCHEMES.has(scheme) ? value : undefined;
};
