// =============================================================================
// Blog post — /[locale]/blog/[slug]
// Full article page: QuickAnswer → KeyTakeaways → ToC → body → FAQ → AuthorCard
// → RelatedPosts. Old slugs automatically 301-redirect to the current slug.
// Metadata and JSON-LD schema inherit: Site Settings → Category → Post.
// =============================================================================

import {notFound, permanentRedirect, redirect} from 'next/navigation'
import ReactDOM from 'react-dom'
import {sanityFetch} from '@/sanity/lib/fetch'
import {
  POST_BY_SLUG_QUERY,
  POST_BY_OLD_SLUG_QUERY,
  POST_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {resolveAiSeo, resolveFaq} from '@/seo/resolve'
import {buildPostSchemas} from '@/schema'
import {imageUrl} from '@/sanity/lib/image'
import {extractHeadings} from '@/utils/portable-text'
import {formatDate, isoDate} from '@/utils/format'
import {localizedPath} from '@/i18n/routing'
import {SITE_URL} from '@/constants/site'

import PostBody from '@/components/blog/PostBody'
import TableOfContents from '@/components/blog/TableOfContents'
import QuickAnswer from '@/components/blog/QuickAnswer'
import KeyTakeaways from '@/components/blog/KeyTakeaways'
import RelatedPosts from '@/components/blog/RelatedPosts'
import AuthorCard from '@/components/blog/AuthorCard'
import FAQSection from '@/components/shared/FAQSection'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import JsonLd from '@/components/shared/JsonLd'

export async function generateStaticParams() {
  const slugs = (await sanityFetch({query: POST_SLUGS_QUERY, tags: ['blogPost']})) || []
  return slugs.map((p) => ({slug: p.slug}))
}

async function loadPost(slug) {
  const [settings, post] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: POST_BY_SLUG_QUERY, params: {slug}, tags: ['blogPost', 'author', 'category']}),
  ])
  return {settings: settings || {}, post}
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params
  const {settings, post} = await loadPost(slug)
  if (!post) return {}
  return buildMetadata({
    settings,
    category: post.category,
    doc: post,
    path: `/blog/${slug}`,
    locale,
    type: 'article',
  })
}

export default async function BlogPostPage({params}) {
  const {locale, slug} = await params
  const {settings, post} = await loadPost(slug)

  if (!post) {
    const moved = await sanityFetch({query: POST_BY_OLD_SLUG_QUERY, params: {slug}, tags: ['blogPost']})
    if (moved?.slug) {
      const destination = localizedPath(locale, `/blog/${moved.slug}`)
      if (moved.permanent !== false) permanentRedirect(destination)
      redirect(destination)
    }
    notFound()
  }

  const aiSeo = resolveAiSeo({doc: post})
  const faqs = resolveFaq({doc: post})
  const headings = post.tocEnabled === false ? [] : extractHeadings(post.body, [2, 3])

  let related = post.relatedPosts || []
  if (!related.length && post.category?._id) {
    related =
      (await sanityFetch({
        query: RELATED_POSTS_QUERY,
        params: {id: post._id, categoryId: post.category._id},
        tags: ['blogPost', 'author', 'category'],
      })) || []
  }

  const url = `${SITE_URL}${localizedPath(locale, `/blog/${slug}`)}`
  const breadcrumbs = [
    {name: 'Home', url: `${SITE_URL}${localizedPath(locale, '/')}`},
    {name: 'Blog', url: `${SITE_URL}${localizedPath(locale, '/blog')}`},
    ...(post.category
      ? [{name: post.category.name, url: `${SITE_URL}${localizedPath(locale, `/blog/category/${post.category.slug}`)}`}]
      : []),
    {name: post.title, url},
  ]
  const schemas = buildPostSchemas({post, url, settings, faqs, breadcrumbs, locale})

  const cover = imageUrl(post.featuredImage, {width: 960, height: 540, quality: 70, fit: 'crop'})
  const coverSrcSet = [640, 760, 960, 1200]
    .map((width) => {
      const src = imageUrl(post.featuredImage, {
        width,
        height: Math.round(width * 9 / 16),
        quality: 70,
        fit: 'crop',
      })
      return src ? `${src} ${width}w` : null
    })
    .filter(Boolean)
    .join(', ')
  const coverSizes = '(max-width: 1024px) calc(100vw - 2rem), 760px'
  if (cover && coverSrcSet) {
    ReactDOM.preload(cover, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: coverSrcSet,
      imageSizes: coverSizes,
    })
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
        <article className="min-w-0">
          <Breadcrumbs
            items={[
              {name: 'Home', href: localizedPath(locale, '/')},
              {name: 'Blog', href: localizedPath(locale, '/blog')},
              ...(post.category
                ? [{name: post.category.name, href: localizedPath(locale, `/blog/category/${post.category.slug}`)}]
                : []),
              {name: post.title},
            ]}
          />

          {post.category ? (
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">{post.category.name}</span>
          ) : null}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-3">{post.title}</h1>

          <div className="flex items-center gap-3 mb-8">
            {post.author ? <AuthorCard author={post.author} compact locale={locale} /> : null}
            {post.publishedAt ? (
              <time className="text-slate-600 text-sm" dateTime={isoDate(post.publishedAt)}>
                {formatDate(post.publishedAt)}
              </time>
            ) : null}
          </div>

          {cover ? (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                srcSet={coverSrcSet}
                sizes={coverSizes}
                alt={post.featuredImage?.alt || post.title}
                width="960"
                height="540"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {aiSeo.quickAnswer ? <QuickAnswer text={aiSeo.quickAnswer} /> : null}
          {aiSeo.keyTakeaways?.length ? <KeyTakeaways items={aiSeo.keyTakeaways} /> : null}

          <PostBody body={post.body} locale={locale} />

          {faqs.length ? <FAQSection heading="Frequently Asked Questions" faqs={faqs} className="!py-10" /> : null}

          <RelatedPosts posts={related} locale={locale} />
        </article>

        {headings.length ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        ) : null}
      </div>

      <JsonLd data={schemas} />
    </main>
  )
}
