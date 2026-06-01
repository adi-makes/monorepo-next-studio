// =============================================================================
// Landing page SEO queries
// Fetches SEO metadata, AI SEO, schema config, and FAQ for code-built landing
// pages. The document slug maps directly to the route: "/" = home, "about"
// = /about, etc. Content/layout lives in Next.js code; this drives the <head>.
// =============================================================================

import {seoFields, aiSeoFields, schemaConfigFields} from './fragments'

/**
 * Landing Page SEO
 *
 * Queries for fetching SEO, metadata, and schema configuration for
 * landing pages that are built in code (not CMS-driven content).
 *
 * Landing page slugs map to route segments:
 * - "/" (home) → slug: "/"
 * - "/about" → slug: "about"
 * - "/contact" → slug: "contact"
 * - "/services" → slug: "services"
 * etc.
 */

const landingPageSeoFields = `{
  _id, _type, title, "slug": slug.current,
  publishedAt, updatedAt, visibility,
  faq,
  "seo": seo${seoFields},
  "aiSeo": aiSeo${aiSeoFields},
  "schemaConfig": schemaConfig${schemaConfigFields}
}`

/**
 * Get landing page SEO by slug
 * @param {string} slug - Page identifier: "/" for home, "about", "contact", etc.
 */
export const LANDING_PAGE_SEO_QUERY = `*[_type == "landingPageSeo" && slug.current == $slug][0] ${landingPageSeoFields}`

/**
 * Get all landing page SEO documents (for sitemap, etc.)
 */
export const ALL_LANDING_PAGES_QUERY = `*[_type == "landingPageSeo" && visibility != "hidden"]{ "slug": slug.current }`
