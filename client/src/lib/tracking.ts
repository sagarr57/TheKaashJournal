// Client-side tracking functions
// Sends page views, events, conversions, and redirections to your backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generate or get session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
}

// Get device type
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Get browser name
function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
}

/**
 * Track a page view
 */
export async function trackPageView(pagePath: string, pageTitle?: string) {
  // Skip tracking in development (API routes only work in production)
  if (import.meta.env.DEV) {
    return;
  }

  try {
    const sessionId = getSessionId();
    const referrer = document.referrer || null;
    
    const response = await fetch(`${API_BASE_URL}/tracking/page-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        page_path: pagePath,
        page_title: pageTitle || document.title,
        referrer: referrer,
        user_agent: navigator.userAgent,
        device_type: getDeviceType(),
        browser: getBrowser(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Silently fail - tracking is optional
    if (import.meta.env.DEV) {
      // Only log in dev for debugging
      console.debug('Page view tracking skipped in development');
    }
  }
}

/**
 * Track time spent on page
 */
let pageViewStartTime = Date.now();
let timeTrackingInterval: NodeJS.Timeout | null = null;

export function startTimeTracking(pagePath: string) {
  // Skip tracking in development (API routes only work in production)
  if (import.meta.env.DEV) {
    return;
  }

  pageViewStartTime = Date.now();
  
  // Track time every 10 seconds
  if (timeTrackingInterval) {
    clearInterval(timeTrackingInterval);
  }
  
  timeTrackingInterval = setInterval(async () => {
    const timeSpent = Math.floor((Date.now() - pageViewStartTime) / 1000);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/page-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: getSessionId(),
          page_path: pagePath,
          view_time_seconds: timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // Silently fail - tracking is optional
    }
  }, 10000); // Every 10 seconds
}

export function stopTimeTracking() {
  if (timeTrackingInterval) {
    clearInterval(timeTrackingInterval);
    timeTrackingInterval = null;
  }
}

/**
 * Track a custom event (clicks, scrolls, downloads, etc.)
 */
export async function trackEvent(
  eventType: string,
  eventName: string,
  data?: {
    elementId?: string;
    elementText?: string;
    elementType?: string;
    value?: number;
    currency?: string;
    metadata?: Record<string, any>;
  }
) {
  // Skip tracking in development (API routes only work in production)
  if (import.meta.env.DEV) {
    return;
  }

  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_BASE_URL}/tracking/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        event_type: eventType,
        event_name: eventName,
        page_path: window.location.pathname,
        element_id: data?.elementId,
        element_text: data?.elementText,
        element_type: data?.elementType,
        gclid: null, // Google Ads tracking removed - will be added later
        value: data?.value,
        currency: data?.currency || 'USD',
        metadata: data?.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Silently fail - tracking is optional
  }
}

/**
 * Track a conversion (purchase, signup, download, etc.)
 */
export async function trackConversion(
  conversionType: string,
  conversionName: string,
  data?: {
    value?: number;
    currency?: string;
    metadata?: Record<string, any>;
  }
) {
  // Skip tracking in development (API routes only work in production)
  if (import.meta.env.DEV) {
    return;
  }

  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_BASE_URL}/tracking/conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        conversion_type: conversionType,
        conversion_name: conversionName,
        gclid: null, // Google Ads tracking removed - will be added later
        value: data?.value,
        currency: data?.currency || 'USD',
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        metadata: data?.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Silently fail - tracking is optional
  }
}

/**
 * Track a redirection (link click, outbound link, etc.)
 */
export async function trackRedirection(
  destinationUrl: string,
  data?: {
    linkText?: string;
    linkType?: string;
    isExternal?: boolean;
    metadata?: Record<string, any>;
  }
) {
  // Skip tracking in development (API routes only work in production)
  if (import.meta.env.DEV) {
    return;
  }

  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_BASE_URL}/tracking/redirection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        source_url: window.location.href,
        destination_url: destinationUrl,
        link_text: data?.linkText,
        link_type: data?.linkType || 'outbound',
        is_external: data?.isExternal !== false,
        gclid: null, // Google Ads tracking removed - will be added later
        metadata: data?.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Silently fail - tracking is optional
  }
}

/**
 * Track button/link clicks automatically
 */
export function trackClick(element: HTMLElement, eventName?: string) {
  const elementId = element.id || element.getAttribute('data-track-id');
  const elementText = element.textContent?.trim() || '';
  const elementType = element.tagName.toLowerCase();
  
  trackEvent('click', eventName || `click_${elementType}`, {
    elementId: elementId || undefined,
    elementText: elementText || undefined,
    elementType: elementType,
  });
}
