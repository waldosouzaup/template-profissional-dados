import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

const BASE_URL = 'https://www.waldoeller.com';

async function generateSitemap() {
  try {
    console.log("Generating sitemap...");
    // Fetch dynamic content
    const { data: projects, error: projectsError } = await supabase.from('projects').select('id').eq('is_published', true);
    const { data: posts, error: postsError } = await supabase.from('contents').select('id');

    if (projectsError) console.error("Error fetching projects for sitemap:", projectsError);
    if (postsError) console.error("Error fetching posts for sitemap:", postsError);

    const urls = [
      '/',
      '/about',
      '/projects',
      '/blog',
    ];

    if (projects) {
      projects.forEach(p => urls.push(`/projects/${p.id}`));
    }

    if (posts) {
      posts.forEach(p => urls.push(`/blog/${p.id}`));
    }

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync('public/sitemap.xml', sitemapContent.trim());
    console.log('Sitemap successfully generated at public/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
