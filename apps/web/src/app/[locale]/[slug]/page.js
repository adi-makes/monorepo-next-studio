import {notFound, redirect} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/fetch'
import {PAGE_BY_SLUG_QUERY, PAGE_BY_OLD_SLUG_QUERY, PAGE_SLUGS_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {resolveFaq, resolveSchemaConfig} from '@/seo/resolve'
import {buildPageSchemas} from '@/schema'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import FAQSection from '@/components/shared/FAQSection'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import Container from '@/components/ui/Container'
import JsonLd from '@/components/shared/JsonLd'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'

export async function generateStaticParams() {
  const slugs = (await sanityFetch({query: PAGE_SLUGS_QUERY, tags: ['page']})) || []
  return slugs.map((p) => ({slug: p.slug}))
}

async function loadPage(slug) {
  const [settings, page] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: PAGE_BY_SLUG_QUERY, params: {slug}, tags: ['page']}),
  ])
  return {settings: settings || {}, page}
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params
  const {settings, page} = await loadPage(slug)
  if (!page) return {}
  return buildMetadata({settings, doc: page, path: `/${slug}`, locale, type: 'website'})
}

export default async function CmsPage({params}) {
  const {locale, slug} = await params
  const {settings, page} = await loadPage(slug)

  if (!page) {
    // Slug history → 301 to the current slug.
    const moved = await sanityFetch({query: PAGE_BY_OLD_SLUG_QUERY, params: {slug}, tags: ['page']})
    if (moved?.slug) redirect(localizedPath(locale, `/${moved.slug}`))
    notFound()
  }

  if (page.isHomepage) redirect(localizedPath(locale, '/'))

  const schemaConfig = resolveSchemaConfig({settings, doc: page})
  const faqs = resolveFaq({doc: page})
  const url = `${SITE_URL}${localizedPath(locale, `/${slug}`)}`
  const breadcrumbs = [
    {name: 'Home', url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: page.title, url},
  ]
  const schemas = buildPageSchemas({page, url, schemaConfig, faqs, breadcrumbs})

  return (
    <main>
      <Container className="pt-8">
        <Breadcrumbs items={[{name: 'Home', href: localizedPath(locale, '/')}, {name: page.title}]} />
      </Container>

      {page.pageBuilder?.length ? (
        <BlockRenderer blocks={page.pageBuilder} locale={locale} />
      ) : (
        <Container className="py-16">
          <h1 className="text-4xl font-bold text-slate-900">{page.title}</h1>
        </Container>
      )}

      {faqs.length ? <FAQSection faqs={faqs} className="bg-slate-50" /> : null}

      <JsonLd data={schemas} />
    </main>
  )
}
