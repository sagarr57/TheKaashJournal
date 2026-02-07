// Hook to automatically track page views and time on page
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, startTimeTracking, stopTimeTracking } from '@/lib/tracking';

export function usePageTracking() {
  const [location] = useLocation();

  useEffect(() => {
    // Track page view when route changes
    const pagePath = location;
    const pageTitle = document.title;

    trackPageView(pagePath, pageTitle);
    startTimeTracking(pagePath);

    // Track time on page before leaving
    return () => {
      stopTimeTracking();
    };
  }, [location]);

  // Track time on page when component unmounts or user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopTimeTracking();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopTimeTracking();
    };
  }, []);
}
