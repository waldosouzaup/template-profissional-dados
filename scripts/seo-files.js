// www.waldoeller.com responds 301 to the apex domain, so every URL must use the apex.
export const SITE_URL = "https://waldoeller.com";

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");

export const buildSitemap = (entries) => {
  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = `    <loc>${escapeXml(SITE_URL + encodeURI(path))}</loc>`;
      return lastmod ? `  <url>\n${loc}\n    <lastmod>${lastmod}</lastmod>\n  </url>` : `  <url>\n${loc}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

// Netlify _redirects rules; they run before the SPA fallback in netlify.toml.
export const buildProjectRedirects = (projects) =>
  projects
    .flatMap(({ id, slug, previous_slugs = [] }) =>
      [id, ...previous_slugs].map((from) => `/projects/${from} /projects/${slug} 301\n`),
    )
    .join("");
