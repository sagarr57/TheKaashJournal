import { useEffect, useRef } from "react";

interface AdUnitProps {
  // Get your slot IDs from AdSense dashboard → Ads → By ad unit → Display ads
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

const PUB_ID = "ca-pub-5606354728180472";

declare global {
  interface Window {
    adsbygoogle: object[];
  }
}

export function AdUnit({ slot, format = "auto", className = "", style }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet — fails silently
    }
  }, []);

  return (
    <div className={`overflow-hidden text-center ${className}`} aria-hidden="true">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
