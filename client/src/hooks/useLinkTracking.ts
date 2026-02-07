// Hook to automatically track link clicks and redirections
import { useEffect } from 'react';
import { trackRedirection, trackEvent } from '@/lib/tracking';

export function useLinkTracking() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Skip internal navigation handled by router
      if (href.startsWith('#') || href.startsWith('/')) {
        // Track internal links as events
        trackEvent('click', 'internal_link_click', {
          elementId: link.id || undefined,
          elementText: link.textContent?.trim() || undefined,
          elementType: 'link',
          metadata: {
            href,
            isInternal: true,
          },
        });
        return;
      }

      // Track external links and redirections
      const isExternal = !href.startsWith(window.location.origin);
      const linkText = link.textContent?.trim() || '';
      
      // Determine link type
      let linkType = 'outbound';
      if (link.getAttribute('data-affiliate')) {
        linkType = 'affiliate';
      } else if (href.includes('mailto:')) {
        linkType = 'email';
      } else if (href.includes('tel:')) {
        linkType = 'phone';
      } else if (href.match(/\.(pdf|doc|docx|xls|xlsx|zip)$/i)) {
        linkType = 'download';
      }

      trackRedirection(href, {
        linkText,
        linkType,
        isExternal,
        metadata: {
          elementId: link.id || undefined,
          className: link.className || undefined,
        },
      });
    };

    document.addEventListener('click', handleClick, true); // Use capture phase

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);
}
