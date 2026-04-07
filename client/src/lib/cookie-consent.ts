export type CookieConsentStatus = "accepted" | "rejected";

export const COOKIE_CONSENT_STORAGE_KEY = "cookie_consent_status";
export const COOKIE_CONSENT_EVENT = "cookie-consent-updated";

export function getCookieConsentStatus(): CookieConsentStatus | null {
  if (typeof window === "undefined") return null;
  const storedValue = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (storedValue === "accepted" || storedValue === "rejected") {
    return storedValue;
  }
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsentStatus() === "accepted";
}

export function setCookieConsentStatus(status: CookieConsentStatus): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: status }));
}
