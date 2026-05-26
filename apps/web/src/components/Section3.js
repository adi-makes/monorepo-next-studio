/* ----------------------------------------------------------------
 * Section 4 — Use-cases / "When do you need [X]?" pattern
 * Three cards on a light background.
 * ---------------------------------------------------------------- */

const USE_CASES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Use case title one',
    desc: 'Placeholder description. Describe a concrete scenario where the user needs this product or service.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Use case title two',
    desc: 'Placeholder description for the second use case. Keep it specific and relatable.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: 'Use case title three',
    desc: 'Placeholder description for the third use case. Tie it back to a clear benefit.',
  },
]

export default function Section4() {
  return (
    <section id="section3" className="bg-slate-50 min-h-[85vh] flex items-center py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Section 3
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
            When Do You Need <span className="text-primary">[Title]</span>?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Placeholder subheading for section four. Help visitors self-qualify and
            understand whether this is right for them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => (
            <div
              key={uc.title}
              className="bg-white border border-slate-200 rounded-xl p-7 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                {uc.icon}
              </div>
              <h3 className="text-slate-900 font-semibold text-lg mb-3">{uc.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
