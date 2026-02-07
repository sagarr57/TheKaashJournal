import { useEffect } from "react";
import { trackEvent, trackConversion } from '@/lib/tracking';

interface GTMProps {
  gtmId: string;
}

export function GTM({ gtmId }: GTMProps) {
  useEffect(() => {
    // Add GTM script to head (exact Google Tag Manager code)
    const script = document.createElement("script");
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(script);

    // Add noscript iframe to body
    const noscript = document.createElement("noscript");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, [gtmId]);

  return null;
}

// Helper function to push events to GTM dataLayer
// Also sends events to our backend for storage in Supabase
export function pushToDataLayer(event: string, data?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...data,
    });
  }

  // Also send to our backend for storage
  // Determine if this is a conversion or regular event
  if (event.includes('conversion') || event.includes('purchase') || event.includes('signup')) {
    trackConversion(
      data?.conversion_type || event,
      data?.conversion_name || event,
      {
        value: data?.value,
        currency: data?.currency,
        metadata: data,
      }
    );
  } else {
    trackEvent(
      'gtm_event',
      event,
      {
        elementId: data?.element_id,
        elementText: data?.element_text,
        elementType: data?.element_type,
        value: data?.value,
        currency: data?.currency,
        metadata: data,
      }
    );
  }
}
