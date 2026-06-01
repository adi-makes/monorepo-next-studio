// =============================================================================
// JSON-LD schema generators — builds structured data objects from Sanity
// content for Google Rich Results, AI search, and voice assistants.
//
// Each file exports one generator function. buildPostSchemas() and
// buildPageSchemas() are the main orchestrators — they call the individual
// generators based on the resolved schemaConfig from Sanity.
//
// Rendered into pages via <JsonLd data={schemas} /> (components/shared/JsonLd).
// =============================================================================

export * from './organization'
export * from './blog'
export * from './website'
export * from './person'
export * from './breadcrumb'
export * from './article'
export * from './faq'
export * from './speakable'
export * from './video'
export * from './image'
export * from './howto'
export * from './product'
export * from './review'
export * from './localBusiness'

import {generateArticleSchema} from './article'
import {generateBreadcrumbSchema} from './breadcrumb'
import {generateFAQSchema} from './faq'
import {generateSpeakableSchema} from './speakable'
import {videoSchemasFromBody} from './video'
import {generateImageSchema} from './image'

/**
 * Compose the JSON-LD graph for a blog post page from resolved config.
 * Returns an array of schema objects (drop nulls).
 *
 * @param {{post:any, url:string, settings?:any, schemaConfig:any, faqs?:any[], breadcrumbs?:{name:string,url:string}[], locale?:string}} opts
 */
export function buildPostSchemas({post, url, settings = {}, schemaConfig = {}, faqs = [], breadcrumbs = [], locale = 'en'}) {
  const out = []
  const primary = schemaConfig.primarySchemaType || 'blogPosting'

  out.push(generateArticleSchema({post, url, settings, type: primary, locale}))

  if (schemaConfig.enableBreadcrumb !== false && breadcrumbs.length) {
    out.push(generateBreadcrumbSchema(breadcrumbs))
  }
  if ((schemaConfig.enableFaqSchema || faqs.length) && faqs.length) {
    out.push(generateFAQSchema(faqs))
  }
  if (schemaConfig.enableSpeakable) {
    out.push(generateSpeakableSchema({url}))
  }
  if (schemaConfig.enableVideoSchema) {
    out.push(...videoSchemasFromBody(post.body))
  }
  if (schemaConfig.enableImageSchema && post.featuredImage) {
    out.push(generateImageSchema(post.featuredImage))
  }
  return out.filter(Boolean)
}

/**
 * Compose JSON-LD for a CMS page from resolved config.
 * @param {{page:any, url:string, schemaConfig:any, faqs?:any[], breadcrumbs?:{name:string,url:string}[]}} opts
 */
export function buildPageSchemas({page, url, schemaConfig = {}, faqs = [], breadcrumbs = []}) {
  const out = []
  if (schemaConfig.enableBreadcrumb !== false && breadcrumbs.length) {
    out.push(generateBreadcrumbSchema(breadcrumbs))
  }
  if ((schemaConfig.enableFaqSchema || faqs.length) && faqs.length) {
    out.push(generateFAQSchema(faqs))
  }
  if (schemaConfig.enableSpeakable) {
    out.push(generateSpeakableSchema({url}))
  }
  return out.filter(Boolean)
}
