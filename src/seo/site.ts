// Site identity shared by the app (SEOHead) and the server-rendered pages. No dependencies: the app bundles it.
export const SITE_URL = "https://waldoeller.com";
export const SITE_NAME = "Waldo Eller";

// Browser tab / search result title.
export const formatTitle = (title: string) => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);
