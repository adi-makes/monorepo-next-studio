// ============================================================================
// Inheritance resolvers — Site Settings -> Category Defaults -> Document.
// Every page builds its effective SEO / AI SEO / schema / FAQ / social from
// these so editors configure values once at the highest sensible level.
// ============================================================================

/** First defined (non-null/undefined) value. */
function firstDefined(...vals) {
  for (const v of vals) if (v !== undefined && v !== null && v !== '') return v
  return undefined
}

/**
 * @param {{settings?:any, category?:any, doc?:any}} ctx
 */
export function resolveSeo({settings, category, doc} = {}) {
  settings = settings || {}
  category = category || {}
  doc = doc || {}
  const s = settings.defaultSeo || {}
  const c = category.seoDefaults || {}
  const d = doc.seo || {}
  const siteSocial = settings.socialDefaults || {}
  const catSocial = category.socialDefaults || {}

  return {
    metaTitle: firstDefined(d.metaTitle, c.metaTitle, s.metaTitle),
    metaDescription: firstDefined(d.metaDescription, c.metaDescription, s.metaDescription, doc.excerpt, settings.description),
    canonicalUrl: d.canonicalUrl, // canonical is document-specific
    ogTitle: firstDefined(d.ogTitle, c.ogTitle, s.ogTitle),
    ogDescription: firstDefined(d.ogDescription, c.ogDescription, s.ogDescription),
    ogImage: firstDefined(d.ogImage, doc.featuredImage, c.ogImage, catSocial.ogImage, s.ogImage, siteSocial.ogImage),
    twitterTitle: firstDefined(d.twitterTitle, c.twitterTitle, s.twitterTitle),
    twitterDescription: firstDefined(d.twitterDescription, c.twitterDescription, s.twitterDescription),
    twitterImage: firstDefined(d.twitterImage, catSocial.twitterImage, s.twitterImage, siteSocial.twitterImage),
    twitterHandle: firstDefined(catSocial.twitterHandle, siteSocial.twitterHandle),
    robots: d.robots || c.robots || s.robots || {},
  }
}

export function resolveAiSeo({settings, category, doc} = {}) {
  settings = settings || {}
  category = category || {}
  doc = doc || {}
  const s = settings.defaultAiSeo || {}
  const c = category.aiSeoDefaults || {}
  const d = doc.aiSeo || {}
  return {
    quickAnswer: firstDefined(d.quickAnswer, c.quickAnswer),
    summary: firstDefined(d.summary, c.summary, s.summary),
    keyTakeaways: (d.keyTakeaways && d.keyTakeaways.length ? d.keyTakeaways : c.keyTakeaways) || [],
    commonQuestions: (d.commonQuestions && d.commonQuestions.length ? d.commonQuestions : c.commonQuestions) || [],
    speakableContent: firstDefined(d.speakableContent, c.speakableContent),
  }
}

export function resolveSchemaConfig({settings, category, doc} = {}) {
  settings = settings || {}
  category = category || {}
  doc = doc || {}
  const s = settings.defaultSchemaConfig || {}
  const c = category.schemaDefaults || {}
  const d = doc.schemaConfig || {}
  return {
    primarySchemaType: firstDefined(d.primarySchemaType, c.primarySchemaType, s.primarySchemaType),
    enableFaqSchema: firstDefined(d.enableFaqSchema, c.enableFaqSchema, s.enableFaqSchema),
    enableSpeakable: firstDefined(d.enableSpeakable, c.enableSpeakable, s.enableSpeakable),
    enableBreadcrumb: firstDefined(d.enableBreadcrumb, c.enableBreadcrumb, s.enableBreadcrumb, true),
    enableVideoSchema: firstDefined(d.enableVideoSchema, c.enableVideoSchema, s.enableVideoSchema),
    enableImageSchema: firstDefined(d.enableImageSchema, c.enableImageSchema, s.enableImageSchema),
  }
}

/** Document FAQ, falling back to category FAQ defaults. */
export function resolveFaq({category, doc} = {}) {
  category = category || {}
  doc = doc || {}
  if (Array.isArray(doc.faq) && doc.faq.length) return doc.faq
  if (Array.isArray(category.faqDefaults) && category.faqDefaults.length) return category.faqDefaults
  return []
}
