/* ----------------------------------------------------------------
 * Testimonials — grid of customer review cards.
 * ---------------------------------------------------------------- */

const REVIEWS = [
  { name: 'Reviewer Name A', handle: '@handle_a', rating: 5, text: 'Placeholder review text. This is a short, genuine-sounding testimonial that highlights a key benefit.' },
  { name: 'Reviewer Name B', handle: '@handle_b', rating: 5, text: 'Placeholder review text. Mention a specific feature or outcome that will resonate with the target audience.' },
  { name: 'Reviewer Name C', handle: '@handle_c', rating: 5, text: 'Placeholder review text. Social proof is most effective when it addresses a common objection.' },
  { name: 'Reviewer Name D', handle: '@handle_d', rating: 4, text: 'Placeholder review text. A mix of 4-star and 5-star reviews can look more authentic.' },
  { name: 'Reviewer Name E', handle: '@handle_e', rating: 5, text: 'Placeholder review text. Including the reviewer handle adds credibility.' },
  { name: 'Reviewer Name F', handle: '@handle_f', rating: 5, text: 'Placeholder review text. Keep individual reviews to 1-3 sentences for scannability.' },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-primary' : 'text-slate-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="bg-white min-h-[85vh] flex items-center py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
            12,000+ Travellers. <span className="text-primary">4.9/5 Rating</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Placeholder testimonials subheading. Update rating and count to match real data.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((review) => (
            <div
              key={review.handle}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6"
            >
              <Stars count={review.rating} />
              <p className="text-slate-700 text-sm leading-relaxed mt-3 mb-4">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{review.name}</p>
                  <p className="text-slate-400 text-xs">{review.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
