// =============================================================================
// QuickAnswer — AI SEO "quick answer" box displayed at the top of blog posts.
// The `.ds-speakable` class marks this section for Speakable JSON-LD schema.
// Content comes from the post's `aiSeo.quickAnswer` field in Sanity.
// =============================================================================

/**
 * AI "Quick Answer" box. Carries the `ds-speakable` class so it can be targeted
 * by Speakable schema for voice assistants.
 */
export default function QuickAnswer({text}) {
  if (!text) return null
  return (
    <div className="ds-speakable bg-primary/5 border border-primary/20 rounded-xl p-5 my-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Quick Answer</p>
      <p className="text-slate-700 leading-relaxed">{text}</p>
    </div>
  )
}
