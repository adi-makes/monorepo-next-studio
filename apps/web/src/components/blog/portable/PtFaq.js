// =============================================================================
// Portable Text FAQ block — renders an inline FAQ section using <FAQSection>.
// The FAQPage JSON-LD is injected by the page, not here.
// =============================================================================

import FaqAccordion from '@/components/shared/FaqAccordion'

export default function PtFaq({value}) {
  const items = value?.items || []
  if (!items.length) return null
  return (
    <div className="my-8">
      {value.title ? <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3> : null}
      <FaqAccordion faqs={items} />
    </div>
  )
}

