import { useEffect } from "react";

interface EzoicAdProps {
  className?: string;
}

export function EzoicAd({ className }: EzoicAdProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.ezstandalone?.cmd) {
      window.ezstandalone.cmd.push(function () {
        window.ezstandalone.showAds();
      });
    }
  }, []);

  return <div className={className} />;
}
