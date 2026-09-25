// HTML building blocks for the server-rendered copy of each page (see netlify/edge-functions/prerender.ts).
// Relative imports with extensions only: this runs in Deno too.
import { Marked } from "marked";
import { safeUrl } from "../lib/url.ts";
import { formatTitle } from "./site.ts";

export { SITE_NAME, SITE_URL } from "./site.ts";

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => ENTITIES[char]);

// Internal paths are stored raw ("dia-0830-revisão-geral") and get percent-encoded; external URLs stay as typed.
// Anything that is not a web, e-mail, phone or relative address becomes "#".
export const href = (url: string) => {
  const safe = safeUrl(url) ?? "#";
  return escapeHtml(safe.startsWith("/") ? encodeURI(safe) : safe);
};

// Raw HTML inside Markdown is shown as text, never executed.
const markdown = new Marked({ gfm: true, async: false });
markdown.use({
  renderer: {
    html: ({ text }) => escapeHtml(text),
    // The page title is the only h1, as on the site: "#" in the text becomes h2.
    heading({ tokens, depth }) {
      const level = Math.max(depth, 2);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
  },
  walkTokens: (token) => {
    if (token.type === "link" || token.type === "image") token.href = safeUrl(token.href) ?? "#";
  },
});

export const renderMarkdown = (source?: string | null) => (source ? (markdown.parse(source) as string) : "");

export interface PageMeta {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}

// Static tags in index.html that each page replaces.
const REPLACED_HEAD_TAGS = [
  /<title>[\s\S]*?<\/title>\s*/gi,
  /<meta\s+name="(?:description|robots)"[^>]*>\s*/gi,
  /<meta\s+property="(?:og:(?:type|title|description|url|image)|twitter:(?:card|title|description|url|image))"[^>]*>\s*/gi,
  /<link\s+rel="canonical"[^>]*>\s*/gi,
  /<script[^>]*id="seo-jsonld"[^>]*>[\s\S]*?<\/script>\s*/gi,
];

const meta = (attr: "name" | "property", key: string, content?: string) =>
  content ? `<meta ${attr}="${key}" content="${escapeHtml(content)}" />` : "";

const headTags = (page: PageMeta) => {
  const title = formatTitle(page.title);
  return [
    `<title>${escapeHtml(title)}</title>`,
    meta("name", "description", page.description),
    meta("name", "robots", page.noindex ? "noindex, follow" : "index, follow"),
    page.canonical ? `<link rel="canonical" href="${escapeHtml(page.canonical)}" />` : "",
    meta("property", "og:type", page.type ?? "website"),
    meta("property", "og:title", title),
    meta("property", "og:description", page.description),
    meta("property", "og:url", page.canonical),
    meta("property", "og:image", page.image),
    meta("property", "twitter:card", page.image ? "summary_large_image" : "summary"),
    meta("property", "twitter:title", title),
    meta("property", "twitter:description", page.description),
    meta("property", "twitter:image", page.image),
    // "<" escaped so text inside the JSON can never close the script tag.
    page.jsonLd ? `<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")}</script>` : "",
    // Browsers that run the app never see this copy flash before React replaces #root; crawlers without JS read it.
    `<script>document.documentElement.classList.add("js")</script><style>.js [data-prerender]{display:none}</style>`,
  ].filter(Boolean);
};

// Replacements use functions: "$&" or "$1" in a post (shell snippets) must stay literal.
export const renderDocument = (shell: string, page: PageMeta, body: string) => {
  let html = REPLACED_HEAD_TAGS.reduce((doc, pattern) => doc.replace(pattern, ""), shell);
  html = html.replace("</head>", () => `  ${headTags(page).join("\n    ")}\n  </head>`);
  return html.replace(/<div id="root">\s*<\/div>/, () => `<div id="root"><div data-prerender>${body}</div></div>`);
};
