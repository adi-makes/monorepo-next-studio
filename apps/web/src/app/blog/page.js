import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'

const POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, slug, category, excerpt, publishedAt,
  "coverImageUrl": coverImage.asset->url
}`

export const metadata = {
  title: 'Blog | YourBrand',
  description: 'Placeholder blog page',
}

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, { next: { revalidate: 60 } })

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Placeholder blog listing page. Add your posts here.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-400 text-sm">[No Image]</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                  {post.category}
                </span>
                <h2 className="text-slate-900 font-semibold text-lg mt-1 mb-2">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
