const DEFAULT_CONTACT_EMAIL = "kaashjournal@gmail.com";

/** Public inbox on /contact and footer. Override with `VITE_CONTACT_EMAIL` in `.env` or Vercel if needed. */
export function getContactEmail(): string {
  const raw = import.meta.env.VITE_CONTACT_EMAIL;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed || DEFAULT_CONTACT_EMAIL;
}
