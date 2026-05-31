import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  /** Set true for above-the-fold / LCP images — disables lazy loading and boosts fetch priority */
  priority?: boolean;
}

export function Image({ src, alt, fallbackSrc = "/images/icon-ai.png", className = "", priority = false, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={handleError}
      className={className}
      {...props}
    />
  );
}
