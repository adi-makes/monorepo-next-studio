'use client'
import { useState } from 'react'

function FAQItem({ faq, open, onToggle }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.question}</span>
        <svg
          className={`w-4 h-4 text-primary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-5 bg-white">
          <p className="text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQAccordion({ faqs }) {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <FAQItem
          key={faq._id}
          faq={faq}
          open={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? null : i)}
        />
      ))}
    </div>
  )
}
