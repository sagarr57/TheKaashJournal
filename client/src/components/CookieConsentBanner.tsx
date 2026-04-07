import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  CookieConsentStatus,
  getCookieConsentStatus,
  setCookieConsentStatus,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus | null>(null);

  useEffect(() => {
    setConsentStatus(getCookieConsentStatus());

    const handleConsentUpdate = (event: Event) => {
      const consentEvent = event as CustomEvent<CookieConsentStatus>;
      setConsentStatus(consentEvent.detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentUpdate);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentUpdate);
    };
  }, []);

  if (consentStatus !== null) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="container py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-700">
            We use cookies and similar technologies to improve your experience and measure traffic.
            See our{" "}
            <a href="/cookie-policy" className="text-blue-600 hover:text-blue-700 underline">
              Cookie Policy
            </a>
            .
          </p>
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setCookieConsentStatus("rejected")}
            >
              Reject
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={() => setCookieConsentStatus("accepted")}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
