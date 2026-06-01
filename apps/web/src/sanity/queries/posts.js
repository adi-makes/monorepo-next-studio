// =============================================================================
// Blog post queries — listings, single post, slug history, related posts.
// postCard: lightweight projection used in listing grids.
// postFull: complete projection for the single-post page (author, body, SEO…).
// =============================================================================

import {
  imageFields,
  seoFields,
  aiSeoFields,
  schemaConfigFields,
  authorFields,
  categoryFields,
  bodyFields,
  liveFilter,
} from './fragments'

/** Card-sized projection for listings. */
const postCard = `{
  _id, _type, title, "slug": slug.current, excerpt, publishedAt, featured,
  "featuredImage": featuredImage${imageFields},
  "category": category->{_id, name, "slug": slug.current},
  "author": author->{_id, name, "slug": slug.current, "image": image${imageFields}}
}`

/** Full projection for a single post page (with inheritance sources). */
const postFull = `{
  _id, _type, title, "slug": slug.current, excerpt, tags, tocEnabled,
  publishedAt, updatedAt, oldSlugs,
  "featuredImage": featuredImage${imageFields},
  "author": author->${authorFields},
  "category": category->${categoryFields},
  ${bodyFields},
  faq,
  "seo": seo${seoFields},
  "aiSeo": aiSeo${aiSeoFields},
  "schemaConfig": schemaConfig${schemaConfigFields},
  "relatedPosts": relatedPosts[]->{${postCardInner()}}
}`

function postCardInner() {
  return `_id, _type, title, "slug": slug.current, excerpt, publishedAt,
  "featuredImage": featuredImage${imageFields},
  "category": category->{_id, name, "slug": slug.current}`
}

export const POSTS_QUERY = `*[_type == "blogPost" && ${liveFilter}] | order(featured desc, publishedAt desc) ${postCard}`

export const POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug && ${liveFilter}][0] ${postFull}`

/** Find the current slug for a post that previously lived at $slug. */
export const POST_BY_OLD_SLUG_QUERY = `*[_type == "blogPost" && $slug in oldSlugs && redirectSettings.enabled != false][0]{
  "slug": slug.current,
  "permanent": coalesce(redirectSettings.permanent, true)
}`

export const POST_SLUGS_QUERY = `*[_type == "blogPost" && ${liveFilter}]{ "slug": slug.current }`

export const FEATURED_POSTS_QUERY = `*[_type == "blogPost" && featured == true && ${liveFilter}] | order(priority desc, publishedAt desc) ${postCard}`

/** Related posts: explicit picks, else latest from the same category. */
export const RELATED_POSTS_QUERY = `*[_type == "blogPost" && _id != $id && category._ref == $categoryId && ${liveFilter}]
  | order(publishedAt desc) [0...3] ${postCard}`
