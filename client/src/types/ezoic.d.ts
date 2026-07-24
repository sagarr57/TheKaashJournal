interface EzoicStandalone {
  cmd: Array<() => void>;
  showAds: (...placeholderIds: number[]) => void;
  destroyPlaceholders: (...placeholderIds: number[]) => void;
  destroyAll: () => void;
  setOutstreamAllowed: (allowed: boolean, opts?: { reason?: string; requestAdOnAllow?: boolean }) => void;
  setInterstitialAllowed: (allowed: boolean, opts?: { reason?: string; requestAdOnAllow?: boolean }) => void;
}

interface Window {
  ezstandalone: EzoicStandalone;
}
