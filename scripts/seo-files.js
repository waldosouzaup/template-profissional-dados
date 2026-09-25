// www.waldoeller.com responds 301 to the apex domain, so every URL must use the apex.
export const SITE_URL = "https://waldoeller.com";

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");

export const buildSitemap = (entries) => {
  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = `    <loc>${escapeXml(SITE_URL + encodeURI(path))}</loc>`;
      return lastmod ? `  <url>\n${loc}\n    <lastmod>${escapeXml(String(lastmod))}</lastmod>\n  </url>` : `  <url>\n${loc}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

// Ids and slugs are lowercase letters, digits and hyphens (the database trigger normalizes slugs);
// anything else is skipped so a stored value can never add its own line to _redirects.
const URL_SEGMENT = /^[a-z0-9-]+$/;
const isSegment = (value) => typeof value === "string" && URL_SEGMENT.test(value);

// Netlify _redirects rules; they run before the SPA fallback in netlify.toml.
export const buildProjectRedirects = (projects) =>
  projects
    .filter(({ slug }) => isSegment(slug))
    .flatMap(({ id, slug, previous_slugs = [] }) =>
      [id, ...(previous_slugs ?? [])].filter(isSegment).map((from) => `/projects/${from} /projects/${slug} 301\n`),
    )
    .join("");

// One sitemap entry per study trail that has posts; lastmod is its newest post.
export const buildTrailEntries = (trails, posts) =>
  trails.flatMap(({ id, slug }) => {
    const dates = posts.filter((post) => post.trail_id === id).map((post) => post.created_at).sort();
    return dates.length ? [{ path: `/blog/trilha/${slug}`, lastmod: dates[dates.length - 1] }] : [];
  });
