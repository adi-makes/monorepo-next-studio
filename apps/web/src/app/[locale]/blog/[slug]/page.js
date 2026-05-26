import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { localizedPath } from '@/i18n/routing'

const POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, category, excerpt, publishedAt, body,
  "coverImageUrl": coverImage.asset->url
}`

const ALL_SLUGS_QUERY = `*[_type == "blogPost"] { "slug": slug.current }`

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const posts = await client.fetch(ALL_SLUGS_QUERY)
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  let post = null
  try {
    post = await client.fetch(POST_QUERY, { slug })
  } catch {
    post = null
  }
  if (!post) return {}
  return { title: `${post.title} | YourBrand`, description: post.excerpt }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function renderBody(body) {
  if (!body?.length) return null
  return body.map((block) => {
    if (block._type !== 'block') return null
    const text = block.children?.map((c) => c.text).join('') ?? ''
    if (block.style === 'h2') return <h2 key={block._key} className="text-2xl font-bold text-slate-900 mt-8 mb-3">{text}</h2>
    if (block.style === 'h3') return <h3 key={block._key} className="text-xl font-bold text-slate-900 mt-6 mb-2">{text}</h3>
    return <p key={block._key} className="text-slate-600 leading-relaxed mb-4">{text}</p>
  })
}

export default async function BlogPostPage({ params }) {
  const { locale, slug } = await params
  let post = null
  try {
    post = await client.fetch(POST_QUERY, { slug }, { next: { revalidate: 60 } })
  } catch {
    post = null
  }
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back link — locale-aware so it stays within the active language */}
        <Link href={localizedPath(locale, '/blog')} className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 mb-8">
          ← Back to Blog
        </Link>

        {/* Header */}
        <span className="text-primary text-xs font-semibold uppercase tracking-wide">{post.category}</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">{post.title}</h1>
        <p className="text-slate-400 text-sm mb-8">{formatDate(post.publishedAt)}</p>

        {/* Cover image */}
        <div className="h-64 bg-slate-100 rounded-xl overflow-hidden relative mb-10">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 text-sm">[No Image]</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="prose-sm sm:prose max-w-none">
          {renderBody(post.body)}
        </div>
      </div>
    </main>
  )
}
