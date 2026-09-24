import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { buildProjectRedirects, buildSitemap, buildTrailEntries } from './seo-files.js';

// Load environment variables
// It will try to load .env.local for local testing
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Skipping sitemap generation.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSeoFiles() {
  try {
    console.log("Generating sitemap and redirects...");
    const [projectsRes, postsRes, pagesRes, trailsRes] = await Promise.all([
      supabase.from('projects').select('id, slug, previous_slugs, is_published, updated_at'),
      // '*' rather than naming trail_id: posts still make it in if blog_trails.sql has not run yet.
      supabase.from('contents').select('*'),
      supabase.from('custom_pages').select('slug, created_at'),
      supabase.from('blog_trails').select('id, slug'),
    ]);

    if (projectsRes.error) console.error("Error fetching projects for sitemap:", projectsRes.error);
    if (postsRes.error) console.error("Error fetching posts for sitemap:", postsRes.error);
    if (pagesRes.error) console.error("Error fetching custom pages for sitemap:", pagesRes.error);
    if (trailsRes.error) console.error("Error fetching blog trails for sitemap:", trailsRes.error);

    const projects = projectsRes.data ?? [];
    const posts = postsRes.data ?? [];
    const entries = [
      { path: '/' },
      { path: '/about' },
      { path: '/projects' },
      { path: '/blog' },
      { path: '/contact' },
      ...projects.filter(p => p.is_published).map(p => ({ path: `/projects/${p.slug}`, lastmod: p.updated_at })),
      ...buildTrailEntries(trailsRes.data ?? [], posts),
      ...posts.map(p => ({ path: `/blog/${p.slug || p.id}`, lastmod: p.created_at })),
      ...(pagesRes.data ?? []).map(p => ({ path: `/p/${p.slug}`, lastmod: p.created_at })),
    ];

    fs.writeFileSync('public/sitemap.xml', buildSitemap(entries));
    fs.writeFileSync('public/_redirects', buildProjectRedirects(projects));
    console.log(`Sitemap (${entries.length} URLs) and _redirects (${projects.length} projects) written to public/`);
  } catch (error) {
    console.error('Error generating SEO files:', error);
  }
}

generateSeoFiles();
