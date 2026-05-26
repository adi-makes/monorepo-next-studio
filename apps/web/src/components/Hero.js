export default function HeroSection() {
  return (
    <section className="bg-secondary text-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
          Placeholder{' '}
          <span className="text-primary">Heading One</span>{' '}
          goes here
        </h1>

        <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
          Placeholder hero subheading. Describe the core value proposition in one or
          two sentences. Focus on what the visitor gains.
        </p>

        <p className="text-slate-500 text-sm">
          ✓ Trust signal one &nbsp;·&nbsp; ✓ Trust signal two &nbsp;·&nbsp; ✓ Trust signal three
        </p>

      </div>
    </section>
  )
}
