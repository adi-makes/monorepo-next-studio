// =============================================================================
// Blog listing — /[locale]/blog
// Shows all published posts ordered by featured + date. Metadata comes from
// the hardcoded fallback below; override by editing this file or adding a
// `landingPageSeo` document with slug "blog" in Sanity.
// =============================================================================

import {sanityFetch} from '@/sanity/lib/fetch'
import {POSTS_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {generateBreadcrumbSchema} from '@/schema'
import BlogCard from '@/components/blog/BlogCard'
import BlogEmptyState from '@/components/blog/BlogEmptyState'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import JsonLd from '@/components/shared/JsonLd'
import Container from '@/components/ui/Container'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'

export async function generateMetadata({params}) {
  const {locale} = await params
  const settings = (await sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']})) || {}
  return buildMetadata({
    settings,
    doc: {title: 'Blog', seo: {metaDescription: 'Latest articles, guides and updates.'}},
    path: '/blog',
    locale,
  })
}

export default async function BlogPage({params}) {
  const {locale} = await params
  const posts = (await sanityFetch({query: POSTS_QUERY, tags: ['blogPost']})) || []

  const crumbs = [
    {name: 'Home', url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: 'Blog', url: `${SITE_URL}${localizedPath(locale, '/blog')}`},
  ]

  return (
    <main className="min-h-screen bg-white py-16">
      <Container>
        <Breadcrumbs items={[{name: 'Home', href: localizedPath(locale, '/')}, {name: 'Blog'}]} />

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Latest articles, guides and updates.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <BlogEmptyState />
          ) : (
            posts.map((post) => <BlogCard key={post._id} post={post} locale={locale} />)
          )}
        </div>
      </Container>

      <JsonLd data={generateBreadcrumbSchema(crumbs)} />
    </main>
  )
}
