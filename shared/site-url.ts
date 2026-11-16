const DEFAULT_SITE_URL = "https://www.thekaashjournal.com";

/** Production canonical host — always use www for thekaashjournal.com. */
export function normalizeSiteUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return DEFAULT_SITE_URL;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "thekaashjournal.com") {
      parsed.hostname = "www.thekaashjournal.com";
    }
    parsed.protocol = "https:";
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** Build an absolute canonical URL from a site origin and optional path. */
export function buildCanonicalUrl(siteUrl: string, path = ""): string {
  const base = normalizeSiteUrl(siteUrl);
  if (!path) return base;

  let normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  return `${base}${normalizedPath}`;
}

/** Adds the site name to a page title only when it fits in the ~60 characters Google shows. */
export function buildPageTitle(title: string, siteName = "The Kaash Journal"): string {
  const withSite = `${title} | ${siteName}`;
  return title.includes(siteName) || withSite.length > 60 ? title : withSite;
}

export { DEFAULT_SITE_URL };
