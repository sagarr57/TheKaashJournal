import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

const defaultTitle = "The Kaash Journal - AI & Fintech Insights";
const defaultDescription = "Explore the intersection of artificial intelligence and financial technology. Real-time solutions, debt management strategies, and the latest fintech innovations.";
const defaultImage = "/images/Kaash_logo.png";
const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

export function SEO({
  title,
  description = defaultDescription,
  image = defaultImage,
  url,
  type = "website",
  author = "The Kaash Journal",
  publishedTime,
  modifiedTime,
  tags = [],
}: SEOProps) {
  const fullTitle = title ? `${title} | The Kaash Journal` : defaultTitle;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      {tags.length > 0 && <meta name="keywords" content={tags.join(", ")} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="The Kaash Journal" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article specific */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {tags.length > 0 &&
            tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}
