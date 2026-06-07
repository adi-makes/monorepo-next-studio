// =============================================================================
// Homepage — /[locale]
// Content is built in code (JSX). SEO metadata, FAQ, and JSON-LD schema are
// managed in Sanity via the `landingPageSeo` document with slug "/".
// To edit copy: update this file. To edit SEO/schema: use Sanity Studio.
// =============================================================================

import {sanityFetch} from '@/sanity/lib/fetch'
import {LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {resolveFaq, resolveAiSeo} from '@/seo/resolve'
import {buildPageSchemas} from '@/seo/schema'
import FAQSection from '@/components/shared/FAQSection'
import BlogQuickAnswer from '@/components/blog/BlogQuickAnswer'
import JsonLd from '@/components/shared/JsonLd'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'
import {getMessages, t} from '@/messages'

/**
 * Homepage
 *
 * Content/layout is built in code. SEO metadata, FAQ, and schema config
 * are managed in Sanity (landingPageSeo document with slug: "/").
 */

async function loadHome() {
  const [settings, seo] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: LANDING_PAGE_SEO_QUERY, params: {slug: '/'}, tags: ['landingPageSeo']}),
  ])
  return {settings: settings || {}, seo}
}

export async function generateMetadata({params}) {
  const {locale} = await params
  const {settings, seo} = await loadHome()
  return buildMetadata({settings, doc: seo || {}, path: '/', locale, type: 'website'})
}

export default async function Home({params}) {
  const {locale} = await params
  const {settings, seo} = await loadHome()
  const messages = getMessages(locale)

  const faqs = resolveFaq({doc: seo || {}})
  const aiSeo = resolveAiSeo({doc: seo || {}})
  const url = `${SITE_URL}${localizedPath(locale, '/')}`
  const schemas = seo ? buildPageSchemas({page: seo, url, settings, faqs, breadcrumbs: []}) : []

  return (
    <main>
      {/* Homepage content built in code */}
      <section className="py-24 text-center bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{t(messages, 'home.heroTitle')}</h1>
          <p className="mt-4 text-lg text-slate-600">{t(messages, 'home.heroDescription')}</p>
        </div>
      </section>

      {/* Speakable target for voice/AI — hidden, feeds Speakable JSON-LD only */}
      <BlogQuickAnswer text={aiSeo.quickAnswer} />

      {/* FAQ from Sanity (if configured for homepage in landingPageSeo) */}
      {faqs.length ? <FAQSection faqs={faqs} locale={locale} className="bg-slate-50" /> : null}

      {/* JSON-LD Schemas from Sanity configuration */}
      <JsonLd data={schemas} />
    </main>
  )
}
