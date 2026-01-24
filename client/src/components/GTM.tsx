import { useEffect } from "react";

interface GTMProps {
  gtmId: string;
}

export function GTM({ gtmId }: GTMProps) {
  useEffect(() => {
    // Add GTM script to head
    const script1 = document.createElement("script");
    script1.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script1);

    // Add noscript iframe to body
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      // Cleanup
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1);
      }
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, [gtmId]);

  return null;
}

// Helper function to push events to GTM dataLayer
export function pushToDataLayer(event: string, data?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...data,
    });
  }
}
