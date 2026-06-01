// =============================================================================
// AuthorCard — displays author name, avatar, role, credentials, bio, and
// social links. Used at the top of blog posts (compact byline) and at the
// bottom as a full bio card. Provides E-E-A-T signals for Google.
//
// No author profile page exists — this is purely a display component.
// Author data comes from the Sanity `author` document via the blog post query.
// =============================================================================

import Image from 'next/image'
import {imageUrl} from '@/sanity/lib/image'

/**
 * @param {{author: import('@/sanity/types').Author, compact?: boolean}} props
 *   compact=true  → small inline byline (used in post header)
 *   compact=false → full bio card (used at bottom of post)
 */
export default function AuthorCard({author, compact = false}) {
  if (!author) return null
  const avatar = imageUrl(author.image, {width: 120, height: 120, fit: 'crop'})

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt={author.image?.alt || author.name}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : null}
        <div className="text-sm">
          <div className="font-medium text-slate-900">{author.name}</div>
          {author.role ? <div className="text-slate-400 text-xs">{author.role}</div> : null}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 p-5 mt-10">
      {avatar ? (
        <Image
          src={avatar}
          alt={author.image?.alt || author.name}
          width={56}
          height={56}
          className="rounded-full object-cover h-14 w-14 flex-none"
        />
      ) : null}
      <div>
        <div className="font-semibold text-slate-900">{author.name}</div>
        {author.role ? <div className="text-sm text-slate-500">{author.role}</div> : null}
        {author.credentials ? <div className="text-xs text-slate-400 mt-0.5">{author.credentials}</div> : null}
        {author.bio ? <p className="mt-2 text-sm text-slate-600 leading-relaxed">{author.bio}</p> : null}
        {author.socials?.length ? (
          <div className="mt-2 flex gap-3 text-sm">
            {author.socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline capitalize">
                {s.platform}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
