import { DEFAULT_SITE_URL, normalizeSiteUrl } from "@shared/site-url";

/** Single source of truth for the site URL used in canonical tags, schema, and OG meta. */
const rawSiteUrl =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL
    : DEFAULT_SITE_URL;

export const SITE_URL = normalizeSiteUrl(rawSiteUrl);
