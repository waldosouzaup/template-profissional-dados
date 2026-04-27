import { useEffect } from "react";
import { useProfiles } from "@/hooks/useProfile";

/**
 * Dynamically updates the favicon based on the profile's favicon_url.
 * Falls back to `/favicon.png` if no custom favicon is set.
 */
const useDynamicFavicon = () => {
  const { data: profiles = [] } = useProfiles();
  const profile = profiles[0];

  useEffect(() => {
    const faviconUrl = profile?.favicon_url;
    if (!faviconUrl) return;

    // Update all favicon link elements
    const linkElements = document.querySelectorAll<HTMLLinkElement>(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );

    if (linkElements.length > 0) {
      linkElements.forEach((link) => {
        link.href = faviconUrl;
        // Auto-detect type from URL
        if (faviconUrl.endsWith(".svg")) {
          link.type = "image/svg+xml";
        } else if (faviconUrl.endsWith(".ico")) {
          link.type = "image/x-icon";
        } else {
          link.type = "image/png";
        }
      });
    } else {
      // Create favicon link if it doesn't exist
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = faviconUrl;
      link.type = faviconUrl.endsWith(".svg")
        ? "image/svg+xml"
        : faviconUrl.endsWith(".ico")
          ? "image/x-icon"
          : "image/png";
      document.head.appendChild(link);
    }
  }, [profile?.favicon_url]);
};

export default useDynamicFavicon;
