// =============================================================================
// FAQSection — reusable section wrapper around FaqAccordion. Accepts a heading,
// optional intro, and an array of {question, answer} objects. Used on blog
// posts (from post/category FAQ), landing pages (from landingPageSeo FAQ), and
// anywhere else FAQs should appear. FAQPage JSON-LD is injected by the page.
// =============================================================================

import FAQAccordion from './FAQAccordion'

/**
 * Reusable visual FAQ section (landing + blog + page builder). The FAQPage
 * JSON-LD is injected separately by the page.
 */
export default function FAQSection({
  heading = 'Frequently Asked Questions',
  intro,
  faqs = [],
  id = 'faq',
  className = '',
}) {
  if (!faqs?.length) return null
  return (
    <section id={id} className={`py-14 ${className}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{heading}</h2>
          {intro ? <p className="mt-3 text-slate-500">{intro}</p> : null}
        </div>
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  )
}
