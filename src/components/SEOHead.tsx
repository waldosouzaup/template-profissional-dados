import { useEffect } from "react";
import { formatTitle } from "@/seo/site";

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  jsonLd?: Record<string, any>;
  noindex?: boolean;
}

/**
 * Updates document <head> meta tags dynamically for SPA SEO.
 * Reuses the tags the server rendered for the first page, and removes the ones a page does not set,
 * so nothing (canonical, cover image, description) carries over from the previous route.
 */
const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOHeadProps) => {
  useEffect(() => {
    // Title
    const fullTitle = formatTitle(title);
    document.title = fullTitle;

    // Sets a meta tag, or removes it when this page has no value for it
    const setMeta = (attr: string, key: string, content?: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!content) {
        el?.remove();
        return;
      }
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setMeta("name", "description", description);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:url", canonical);

    // Twitter
    setMeta("property", "twitter:card", ogImage ? "summary_large_image" : "summary");
    setMeta("property", "twitter:title", fullTitle);
    setMeta("property", "twitter:description", description);
    setMeta("property", "twitter:image", ogImage);

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      link?.remove();
    } else {
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // JSON-LD structured data
    if (jsonLd) {
      const existingScript = document.getElementById("seo-jsonld");
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Cleanup
    return () => {
      const existingScript = document.getElementById("seo-jsonld");
      if (existingScript) existingScript.remove();
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd, noindex]);

  return null;
};

export default SEOHead;
