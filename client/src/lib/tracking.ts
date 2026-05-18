// Client-side tracking — writes directly to Supabase (works in dev + production)
import { supabase } from './supabase';
import { hasAnalyticsConsent } from './cookie-consent';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('tracking_session_id');
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('tracking_session_id', id);
  }
  return id;
}

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

export async function trackPageView(pagePath: string, pageTitle?: string) {
  if (!hasAnalyticsConsent()) return;
  try {
    await supabase.from('page_views').insert({
      session_id: getSessionId(),
      page_path: pagePath,
      page_title: pageTitle || document.title,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),
      browser: getBrowser(),
      view_time_seconds: 0,
      is_bounce: true,
    });
  } catch {
    // silent fail — tracking is optional
  }
}

let _pageViewStartTime = Date.now();
let _timeInterval: ReturnType<typeof setInterval> | null = null;

export function startTimeTracking(pagePath: string) {
  if (!hasAnalyticsConsent()) return;
  _pageViewStartTime = Date.now();
  if (_timeInterval) clearInterval(_timeInterval);

  _timeInterval = setInterval(async () => {
    const secs = Math.floor((Date.now() - _pageViewStartTime) / 1000);
    const sid = getSessionId();
    try {
      // Update the most-recent page_view row for this session + path
      const { data } = await supabase
        .from('page_views')
        .select('id')
        .eq('session_id', sid)
        .eq('page_path', pagePath)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data?.id) {
        await supabase
          .from('page_views')
          .update({ view_time_seconds: secs, is_bounce: secs < 10 })
          .eq('id', data.id);
      }
    } catch {
      // silent fail
    }
  }, 15000); // every 15 seconds
}

export function stopTimeTracking() {
  if (_timeInterval) {
    clearInterval(_timeInterval);
    _timeInterval = null;
  }
}

export async function trackEvent(
  eventType: string,
  eventName: string,
  data?: {
    elementId?: string;
    elementText?: string;
    elementType?: string;
    value?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
  }
) {
  if (!hasAnalyticsConsent()) return;
  try {
    await supabase.from('events').insert({
      session_id: getSessionId(),
      event_type: eventType,
      event_name: eventName,
      page_path: window.location.pathname,
      element_id: data?.elementId ?? null,
      element_text: data?.elementText ?? null,
      element_type: data?.elementType ?? null,
      value: data?.value ?? null,
      currency: data?.currency ?? 'USD',
      metadata: data?.metadata ?? null,
    });
  } catch {
    // silent fail
  }
}

export async function trackConversion(
  conversionType: string,
  conversionName: string,
  data?: { value?: number; currency?: string; metadata?: Record<string, unknown> }
) {
  if (!hasAnalyticsConsent()) return;
  try {
    await supabase.from('conversions').insert({
      session_id: getSessionId(),
      conversion_type: conversionType,
      conversion_name: conversionName,
      value: data?.value ?? null,
      currency: data?.currency ?? 'USD',
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      metadata: data?.metadata ?? null,
    });
  } catch {
    // silent fail
  }
}

export async function trackRedirection(
  destinationUrl: string,
  data?: {
    linkText?: string;
    linkType?: string;
    isExternal?: boolean;
    metadata?: Record<string, unknown>;
  }
) {
  if (!hasAnalyticsConsent()) return;
  try {
    await supabase.from('redirections').insert({
      session_id: getSessionId(),
      source_url: window.location.href,
      destination_url: destinationUrl,
      link_text: data?.linkText ?? null,
      link_type: data?.linkType ?? 'outbound',
      is_external: data?.isExternal !== false,
      metadata: data?.metadata ?? null,
    });
  } catch {
    // silent fail
  }
}

export function trackClick(element: HTMLElement, eventName?: string) {
  trackEvent('click', eventName || `click_${element.tagName.toLowerCase()}`, {
    elementId: element.id || element.getAttribute('data-track-id') || undefined,
    elementText: element.textContent?.trim() || undefined,
    elementType: element.tagName.toLowerCase(),
  });
}
