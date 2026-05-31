/** Single source of truth for the site URL used in canonical tags, schema, and OG meta. */
export const SITE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL
    : "https://www.thekaashjournal.com";
