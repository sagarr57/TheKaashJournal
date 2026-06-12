import { Helmet } from "react-helmet-async";
import { buildCanonicalUrl } from "@shared/site-url";
import { SITE_URL } from "@/lib/config";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  category?: string;
  noIndex?: boolean;
}

const defaultTitle = "The Kaash Journal - AI & Fintech Insights for UK Audiences";
const defaultDescription =
  "Expert guides on AI, fintech, and debt management for UK readers. FCA-aware, jargon-free insights on personal finance, open banking, and smart money tools.";
const defaultImage = "/images/Kaash_logo.png";

export function SEO({
  title,
  description = defaultDescription,
  image = defaultImage,
  imageWidth = 1200,
  imageHeight = 630,
  url,
  type = "website",
  author = "The Kaash Journal",
  publishedTime,
  modifiedTime,
  tags = [],
  category,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | The Kaash Journal` : defaultTitle;
  const canonicalUrl = buildCanonicalUrl(SITE_URL, url ?? "");
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? "noindex, follow" : "index, follow"} />
      <meta name="language" content="en-GB" />
      {tags.length > 0 && <meta name="keywords" content={tags.join(", ")} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:site_name" content="The Kaash Journal" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TheKaashJournal" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article-specific meta */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {category && (
            <meta property="article:section" content={category} />
          )}
          {tags.length > 0 &&
            tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Canonical + hreflang for UK targeting */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
}
