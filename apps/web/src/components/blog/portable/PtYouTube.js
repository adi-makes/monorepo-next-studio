// =============================================================================
// Portable Text YouTube block — renders a privacy-friendly youtube-nocookie.com embed iframe.
// =============================================================================

import {youTubeEmbedUrl} from '@/utils/embed'

export default function PtYouTube({value}) {
  if (!value?.url) return null
  return (
    <figure className="my-8">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
        <iframe
          src={youTubeEmbedUrl(value.url)}
          title={value.title || 'YouTube video'}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {value.title ? <figcaption className="text-center text-sm text-slate-400 mt-2">{value.title}</figcaption> : null}
    </figure>
  )
}

