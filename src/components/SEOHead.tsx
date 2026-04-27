import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  jsonLd?: Record<string, any>;
}

/**
 * Updates document <head> meta tags dynamically for SPA SEO.
 * Works with react-helmet-less SPAs by directly manipulating DOM.
 */
const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  jsonLd,
}: SEOHeadProps) => {
  useEffect(() => {
    // Title
    const fullTitle = title.includes("Waldo Eller")
      ? title
      : `${title} | Waldo Eller`;
    document.title = fullTitle;

    // Helper to set meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    if (description) {
      setMeta("name", "description", description);
    }

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    if (description) setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    if (ogImage) setMeta("property", "og:image", ogImage);
    if (canonical) {
      setMeta("property", "og:url", canonical);
    }

    // Twitter
    setMeta("property", "twitter:title", fullTitle);
    if (description) setMeta("property", "twitter:description", description);
    if (ogImage) setMeta("property", "twitter:image", ogImage);

    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
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
  }, [title, description, canonical, ogImage, ogType, jsonLd]);

  return null;
};

export default SEOHead;
