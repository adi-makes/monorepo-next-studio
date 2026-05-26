/* ----------------------------------------------------------------
 * Section 1 — Info / "What is [X]?" pattern
 * Two-column: copy + icon grid on left, illustration on right.
 * ---------------------------------------------------------------- */

const FEATURES = [
  { icon: '◈', title: 'Feature title one',   desc: 'Short placeholder description for feature one.' },
  { icon: '◈', title: 'Feature title two',   desc: 'Short placeholder description for feature two.' },
  { icon: '◈', title: 'Feature title three', desc: 'Short placeholder description for feature three.' },
  { icon: '◈', title: 'Feature title four',  desc: 'Short placeholder description for feature four.' },
]

export default function Section1() {
  return (
    <section id="section1" className="bg-white min-h-[85vh] flex items-center py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Copy + feature grid */}
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Section 1
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
              What is <span className="text-primary">[Heading One]</span>?
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-lg">
              Placeholder paragraph. Explain the concept clearly and concisely. Two to
              three sentences works well here to give context before the feature grid.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="shrink-0 w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-base">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{f.title}</p>
                    <p className="text-slate-500 text-sm mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder illustration */}
          <div className="hidden lg:flex justify-center">
            <div className="w-full max-w-sm aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-slate-400 text-xs">[Section 1 Image]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
