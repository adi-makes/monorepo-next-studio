import { client } from '@/sanity/lib/client'
import FAQAccordion from './FAQAccordion'

const FAQ_QUERY = `*[_type == "faqItem"] | order(order asc) { _id, question, answer }`

export default async function FAQ() {
  const faqs = await client.fetch(FAQ_QUERY, {}, { next: { revalidate: 60 } })

  return (
    <section className="bg-slate-50 min-h-[85vh] flex items-center py-16">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-slate-500">
            Can't find what you're looking for?{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              Contact support
            </a>
          </p>
        </div>

        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  )
}
