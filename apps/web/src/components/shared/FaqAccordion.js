// =============================================================================
// FaqAccordion — animated accordion for FAQ lists. Opens one item at a time.
// Used inside FAQSection. ChevronDown rotates 180° when an item is open.
// =============================================================================

'use client'
import {useState} from 'react'
import {ChevronDown} from 'lucide-react'

/**
 * Reusable accordion for FAQ lists. Used by FAQSection and the in-body FAQ
 * block.
 * @param {{faqs:{question:string,answer:string}[]}} props
 */
export default function FaqAccordion({faqs = []}) {
  const [open, setOpen] = useState(null)
  if (!faqs.length) return null

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-slate-900">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen ? <p className="pb-5 -mt-1 text-slate-600 leading-relaxed">{faq.answer}</p> : null}
          </div>
        )
      })}
    </div>
  )
}

