/** Named contributors with public profile pages. */
export const NAMED_AUTHOR_SLUGS = ["kash", "saga"] as const;

export type NamedAuthorSlug = (typeof NAMED_AUTHOR_SLUGS)[number];

const GENERIC_AUTHOR_NAMES = new Set(
  ["team kaash", "the kaash journal", "editorial team", "kaash journal"].map((n) =>
    n.toLowerCase()
  )
);

export function getAuthorSlug(authorName: string | undefined | null): NamedAuthorSlug | null {
  const trimmed = authorName?.trim();
  if (!trimmed || GENERIC_AUTHOR_NAMES.has(trimmed.toLowerCase())) return null;
  const slug = trimmed.toLowerCase() as NamedAuthorSlug;
  return NAMED_AUTHOR_SLUGS.includes(slug) ? slug : null;
}

export function getAuthorProfilePath(authorName: string | undefined | null): string | null {
  const slug = getAuthorSlug(authorName);
  return slug ? `/author/${slug}` : null;
}
