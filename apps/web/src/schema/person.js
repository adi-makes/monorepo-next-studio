// =============================================================================
// Person schema generator — builds a schema.org Person node for blog post
// authors. Used for E-E-A-T (Expertise, Authoritativeness, Trustworthiness)
// signals in Google Search. Nested inside Article/BlogPosting schemas.
//
// Note: there is no public author profile page. The `url` field is omitted
// intentionally. Social links are used for `sameAs` instead.
// =============================================================================

import {imageUrl} from '@/sanity/lib/image'

const CONTEXT = 'https://schema.org'

/**
 * Generate a Person JSON-LD node for an author.
 * `withContext: true` adds @context for use as a standalone root node.
 * Omit withContext when nesting inside an Article.author field.
 *
 * @param {import('@/sanity/types').Author} author
 * @param {{withContext?:boolean}} [opts]
 */
export function generatePersonSchema(author, {withContext = false} = {}) {
  if (!author) return null

  const schema = {
    ...(withContext ? {'@context': CONTEXT} : {}),
    '@type': 'Person',
    name: author.name,
  }

  if (author.role) schema.jobTitle = author.role
  if (author.bio) schema.description = author.bio

  const img = imageUrl(author.image, {width: 400})
  if (img) schema.image = img

  if (Array.isArray(author.expertise) && author.expertise.length) {
    schema.knowsAbout = author.expertise
  }

  // Social profile URLs serve as sameAs links (E-E-A-T).
  const sameAs = (author.socials || []).map((s) => s?.url).filter(Boolean)
  if (sameAs.length) schema.sameAs = sameAs

  return schema
}
