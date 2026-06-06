// =============================================================================
// FAQ page — /[locale]/faq
// FAQ content is curated in Sanity Studio: open the "FAQ" Landing Page document
// (Site Settings → Landing Page → FAQ) and pick which `faqItem` documents to
// show from the FAQ Items dropdown. SEO metadata and key takeaways are managed
// on the same document.
// =============================================================================

import {sanityFetch} from '@/sanity/lib/fetch'
import {LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {resolveAiSeo, resolveFaq} from '@/seo/resolve'
import {buildPageSchemas} from '@/schema'
import JsonLd from '@/components/shared/JsonLd'
import FAQSection from '@/components/shared/FAQSection'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import QuickAnswer from '@/components/blog/QuickAnswer'
import KeyTakeaways from '@/components/blog/KeyTakeaways'
import Container from '@/components/ui/Container'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'

async function loadFaqPage() {
  const [settings, pageSeo] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: LANDING_PAGE_SEO_QUERY, params: {slug: 'faq'}, tags: ['landingPageSeo', 'faqItem']}),
  ])
  return {settings: settings || {}, pageSeo: pageSeo || {}}
}

export async function generateMetadata({params}) {
  const {locale} = await params
  const {settings, pageSeo} = await loadFaqPage()
  return buildMetadata({
    settings,
    doc: pageSeo,
    path: '/faq',
    locale,
  })
}

export default async function FaqPage({params}) {
  const {locale} = await params
  const {settings, pageSeo} = await loadFaqPage()

  const aiSeo = resolveAiSeo({doc: pageSeo})

  // FAQs come from the FAQ landing document's selection (selectedFaqs dropdown).
  const faqs = resolveFaq({doc: pageSeo})

  const url = `${SITE_URL}${localizedPath(locale, '/faq')}`
  const breadcrumbs = [
    {name: 'Home', url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: 'FAQ', url},
  ]

  const schemas = buildPageSchemas({page: pageSeo, url, settings, faqs, breadcrumbs})

  return (
    <main className="min-h-screen bg-white">
      <Container className="py-14">
        <Breadcrumbs
          items={[
            {name: 'Home', href: localizedPath(locale, '/')},
            {name: 'FAQ'},
          ]}
        />

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              {pageSeo?.title || 'Frequently Asked Questions'}
            </h1>
            {pageSeo?.seo?.metaDescription ? (
              <p className="mt-3 text-slate-500 text-lg">{pageSeo.seo.metaDescription}</p>
            ) : null}
          </div>

          {aiSeo.quickAnswer ? <QuickAnswer text={aiSeo.quickAnswer} /> : null}
          {aiSeo.keyTakeaways?.length ? <KeyTakeaways items={aiSeo.keyTakeaways} /> : null}

          {faqs.length ? (
            <FAQSection
              heading=""
              faqs={faqs}
              className="!py-0"
            />
          ) : (
            <p className="text-center text-slate-400 py-12">No FAQ items found.</p>
          )}
        </div>
      </Container>

      <JsonLd data={schemas} />
    </main>
  )
}
