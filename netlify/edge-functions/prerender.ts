// Serves every public page with its real content in the HTML (title, meta, JSON-LD and full text),
// so AI assistants and crawlers that do not run JavaScript can read the site. Also serves /llms.txt.
// The page logic lives in src/seo/prerender.ts (unit-tested); this file only bridges it to Netlify.
import { buildLlmsTxt, createRest, prerender } from "../../src/seo/prerender.ts";

interface Context {
  next(): Promise<Response>;
}
declare const Netlify: { env: { get(name: string): string | undefined } };

// Edits show up within 5 minutes; stale copies keep the site fast while the CDN refreshes them. Deploys purge it all.
const CDN_CACHE = "public, s-maxage=300, stale-while-revalidate=604800";

const withHeaders = (response: Response, status: string) => {
  const headers = new Headers(response.headers);
  headers.set("x-prerender", status);
  return new Response(response.body, { status: response.status, headers });
};

export default async (request: Request, context: Context) => {
  if (request.method !== "GET") return context.next();

  const url = new URL(request.url);
  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL");
  const anonKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY");
  // Without the variables (scope must include Functions), the site still works as a plain SPA.
  if (!supabaseUrl || !anonKey) return withHeaders(await context.next(), "no-env");
  const rest = createRest(supabaseUrl, anonKey);

  if (url.pathname === "/llms.txt") {
    try {
      return new Response(await buildLlmsTxt(rest), {
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          "cache-control": "public, max-age=0, must-revalidate",
          "netlify-cdn-cache-control": CDN_CACHE,
          "x-prerender": "llms",
        },
      });
    } catch (error) {
      console.error("llms.txt failed:", error);
      return new Response("Temporariamente indisponível.", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
    }
  }

  const response = await context.next();
  // Static files, redirects and anything that is not the app shell pass through untouched.
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("text/html")) return response;

  const shell = await response.text();
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("etag");

  try {
    const result = await prerender(url.pathname, shell, rest);
    headers.set("netlify-cdn-cache-control", CDN_CACHE);
    headers.set("x-prerender", "hit");
    if (result.type === "redirect") {
      return new Response(null, { status: result.status, headers: { location: result.location, "netlify-cdn-cache-control": CDN_CACHE } });
    }
    return new Response(result.html, { status: result.status, headers });
  } catch (error) {
    // Supabase slow or down: serve the plain app, which loads its data in the browser as before.
    console.error(`prerender failed for ${url.pathname}:`, error);
    headers.set("x-prerender", "error");
    return new Response(shell, { status: 200, headers });
  }
};

export const config = {
  path: "/*",
  excludedPath: [
    "/admin", "/admin/*", "/assets/*",
    "/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/favicon.ico", "/favicon.png", "/placeholder.svg",
    "/*.js", "/*.css", "/*.png", "/*.jpg", "/*.jpeg", "/*.webp", "/*.svg", "/*.ico", "/*.woff2", "/*.pdf",
  ],
  cache: "manual",
};
