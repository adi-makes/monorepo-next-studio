/* ----------------------------------------------------------------
 * Section 2 — Features / "Why choose us" pattern
 * Dark background, grid of feature cards.
 * ---------------------------------------------------------------- */

const CARDS = [
  { icon: '⬡', title: 'Benefit title one',   desc: 'Placeholder description for benefit one. Keep it short and punchy.' },
  { icon: '⬡', title: 'Benefit title two',   desc: 'Placeholder description for benefit two. Keep it short and punchy.' },
  { icon: '⬡', title: 'Benefit title three', desc: 'Placeholder description for benefit three.' },
  { icon: '⬡', title: 'Benefit title four',  desc: 'Placeholder description for benefit four.' },
  { icon: '⬡', title: 'Benefit title five',  desc: 'Placeholder description for benefit five.' },
  { icon: '⬡', title: 'Benefit title six',   desc: 'Placeholder description for benefit six.' },
]

export default function Section2() {
  return (
    <section id="section2" className="bg-secondary min-h-[85vh] flex items-center py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Section 2
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
            Why <span className="text-primary">12,000+</span> [Customers] Choose Us
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Placeholder subheading for section two. Reinforce your value proposition
            before presenting individual benefits.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-tertiary border border-slate-700 rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/15 text-primary rounded-lg flex items-center justify-center text-lg mb-4">
                {card.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
