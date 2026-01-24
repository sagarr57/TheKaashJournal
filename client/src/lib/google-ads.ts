/**
 * Google Ads (GCLID) Tracking Utility
 * Captures and stores Google Click IDs from URL parameters for conversion tracking
 */

const GCLID_STORAGE_KEY = 'gclid';
const GCLID_EXPIRY_DAYS = 30; // Google Ads attribution window

interface GclidData {
  gclid: string;
  timestamp: number;
  source: string;
  medium?: string;
  campaign?: string;
}

/**
 * Extract GCLID and other Google Ads parameters from URL
 */
export function extractGclidFromUrl(): GclidData | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get('gclid');
  
  if (!gclid) return null;

  return {
    gclid,
    timestamp: Date.now(),
    source: urlParams.get('utm_source') || 'google',
    medium: urlParams.get('utm_medium') || 'cpc',
    campaign: urlParams.get('utm_campaign') || undefined,
  };
}

/**
 * Store GCLID in localStorage with expiry
 */
export function storeGclid(gclidData: GclidData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(GCLID_STORAGE_KEY, JSON.stringify(gclidData));
  } catch (error) {
    console.error('Failed to store GCLID:', error);
  }
}

/**
 * Get stored GCLID if still valid
 */
export function getStoredGclid(): GclidData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(GCLID_STORAGE_KEY);
    if (!stored) return null;

    const gclidData: GclidData = JSON.parse(stored);
    const expiryTime = gclidData.timestamp + (GCLID_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // Check if expired
    if (Date.now() > expiryTime) {
      localStorage.removeItem(GCLID_STORAGE_KEY);
      return null;
    }

    return gclidData;
  } catch (error) {
    console.error('Failed to retrieve GCLID:', error);
    return null;
  }
}

/**
 * Initialize GCLID tracking - call this on app load
 */
export function initGclidTracking(): void {
  if (typeof window === 'undefined') return;

  // Check URL for new GCLID
  const urlGclid = extractGclidFromUrl();
  if (urlGclid) {
    storeGclid(urlGclid);
    
    // Push to GTM dataLayer for Google Ads conversion tracking
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'google_ads_click',
        gclid: urlGclid.gclid,
        source: urlGclid.source,
        medium: urlGclid.medium,
        campaign: urlGclid.campaign,
      });
    }
  }
}

/**
 * Track conversion event with GCLID
 * Call this when a conversion happens (newsletter signup, purchase, etc.)
 */
export function trackConversion(
  conversionType: 'newsletter_signup' | 'click' | 'page_view' | 'custom',
  value?: number,
  currency: string = 'USD'
): void {
  if (typeof window === 'undefined') return;

  const gclidData = getStoredGclid();
  
  if (!gclidData) {
    // No GCLID stored, still track the event but without conversion attribution
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'conversion',
        conversion_type: conversionType,
        value,
        currency,
      });
    }
    return;
  }

  // Track conversion with GCLID for Google Ads
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'conversion',
      conversion_type: conversionType,
      gclid: gclidData.gclid,
      source: gclidData.source,
      medium: gclidData.medium,
      campaign: gclidData.campaign,
      value,
      currency,
      // Google Ads conversion tracking
      google_ads_conversion: true,
    });
  }

  // Also send to Google Ads conversion API if needed
  // This would typically be handled by GTM, but you can add direct API calls here
}

/**
 * Get current GCLID for API calls
 */
export function getCurrentGclid(): string | null {
  const gclidData = getStoredGclid();
  return gclidData?.gclid || null;
}
