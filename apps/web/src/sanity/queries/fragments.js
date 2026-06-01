// ============================================================================
// Reusable GROQ projections & filters. Keep GROQ out of components — compose
// these fragments in the query files instead.
// ============================================================================

/** Image projection: CDN url + metadata + the imageWithMeta fields. */
export const imageFields = `{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions,
  "alt": coalesce(alt, ""),
  caption,
  credit,
  hotspot,
  crop
}`

/** SEO object projection. */
export const seoFields = `{
  metaTitle, metaDescription, canonicalUrl,
  ogTitle, ogDescription, "ogImage": ogImage${imageFields},
  twitterTitle, twitterDescription, "twitterImage": twitterImage${imageFields},
  robots
}`

/** AI SEO object projection. */
export const aiSeoFields = `{
  quickAnswer, summary, keyTakeaways, commonQuestions, speakableContent
}`

/** Schema config projection. */
export const schemaConfigFields = `{
  primarySchemaType, enableFaqSchema, enableSpeakable,
  enableBreadcrumb, enableVideoSchema, enableImageSchema
}`

/** Social defaults projection. */
export const socialDefaultsFields = `{
  "ogImage": ogImage${imageFields},
  "twitterImage": twitterImage${imageFields},
  twitterHandle
}`

/** Author projection (full, for E-E-A-T). */
export const authorFields = `{
  _id, _type, name, "slug": slug.current, role, bio, expertise, credentials,
  "image": image${imageFields}, socials
}`

/** Category projection including inheritable defaults. */
export const categoryFields = `{
  _id, _type, name, "slug": slug.current, description,
  "image": image${imageFields},
  "seoDefaults": seoDefaults${seoFields},
  "aiSeoDefaults": aiSeoDefaults${aiSeoFields},
  "schemaDefaults": schemaDefaults${schemaConfigFields},
  faqDefaults,
  "socialDefaults": socialDefaults${socialDefaultsFields}
}`

/** Resolve an internal reference (link / cta) to {_type, slug}. */
const linkResolve = `{
  ...,
  "internal": internal->{_type, "slug": slug.current}
}`

/**
 * Portable Text body with resolved internal links and dereferenced media.
 * Annotations and link-bearing blocks get their reference resolved to a slug
 * so the frontend can build live URLs via resolveHref().
 */
export const bodyFields = `body[]{
  ...,
  _type == "image" => {
    ...,
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions
  },
  _type == "ctaBlock" => { ..., link${linkResolve} },
  _type == "faqBlock" => { ... },
  markDefs[]{
    ...,
    _type == "link" => ${linkResolve}
  }
}`

/**
 * Public visibility filter. References `$preview` (always injected by
 * sanityFetch) so editors previewing drafts bypass status/schedule gating.
 */
export const liveFilter = `(
  (!defined(status) || status == "published" || $preview) &&
  (!defined(publishAt) || publishAt <= now() || $preview) &&
  (!defined(unpublishAt) || unpublishAt > now() || $preview) &&
  (visibility != false || $preview)
)`
