# MVP Blueprint — Next.js + Sanity Monorepo

> **For AI agents:** Reproduce this project exactly, one-to-one. Every file is given verbatim. Do not add, remove, or rename anything unless the user asks. Follow the setup guide (`nextjs-sanity-monorepo-setup.md`) first to scaffold the base monorepo, then layer all files below on top of it.

---

## What this MVP is

A production-ready landing page + blog monorepo with:

- **Landing page** — full-screen hero, 3 content sections, testimonials, FAQ (Sanity-driven)
- **Blog** — listing page + detail page, fully Sanity-driven (title, slug, category, excerpt, cover image, body, publishedAt)
- **Navbar** — sticky, dark, mobile hamburger, anchor + page links
- **Footer** — 4-column links + brand + social icons (X, LinkedIn, GitHub, YouTube)
- **Sanity Studio** — `faqItem` and `blogPost` schemas registered and ready
- **Color system** — 3 CSS variables retheme the entire app instantly

---

## Tech stack

| Layer | Package | Version |
|---|---|---|
| Framework | next | 16.2.6 |
| UI | react / react-dom | 19.2.4 |
| Styling | tailwindcss | ^4 |
| CMS client | next-sanity | ^13.0.3 |
| Studio | sanity | ^5.26.0 |
| Dev runner | concurrently | ^9 |

---

## Full directory structure

```
monorepo/
├── .gitignore
├── README.md
├── AGENT_BLUEPRINT.md          ← this file
├── package.json
├── package-lock.json
└── apps/
    ├── studio/
    │   ├── eslint.config.mjs
    │   ├── package.json
    │   ├── sanity.cli.ts
    │   ├── sanity.config.ts
    │   ├── schemaTypes/
    │   │   ├── index.ts
    │   │   ├── blogPost.ts
    │   │   └── faqItem.ts
    │   ├── static/
    │   │   └── .gitkeep
    │   └── tsconfig.json
    └── web/
        ├── .env.example
        ├── .env.local              ← gitignored
        ├── eslint.config.mjs
        ├── jsconfig.json
        ├── next.config.mjs
        ├── package.json
        ├── postcss.config.mjs
        └── src/
            ├── app/
            │   ├── globals.css
            │   ├── layout.js
            │   ├── page.js
            │   └── blog/
            │       ├── page.js
            │       └── [slug]/
            │           └── page.js
            ├── components/
            │   ├── Navbar.js
            │   ├── Footer.js
            │   ├── Hero.js
            │   ├── Section1.js
            │   ├── Section2.js
            │   ├── Section3.js
            │   ├── Testimonials.js
            │   ├── FAQ.js
            │   └── FAQAccordion.js
            └── sanity/
                └── lib/
                    └── client.js
```

---

## Color system

Defined once in `globals.css`. Change these 3 values to retheme everything:

| Variable | Default | Used for |
|---|---|---|
| `--color-primary` | `#10b981` | Buttons, badges, links, highlights, star ratings |
| `--color-secondary` | `#0f172a` | Navbar, Hero bg, dark sections, Footer bg |
| `--color-tertiary` | `#1e293b` | Cards and panels inside dark sections |

These become Tailwind classes: `bg-primary`, `text-secondary`, `border-tertiary`, etc.

---

## Section layout pattern

Every section (except Hero) uses this pattern:

```jsx
<section className="bg-[color] min-h-[85vh] flex items-center py-16">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* content */}
  </div>
</section>
```

- `min-h-[85vh]` — section takes ~85% of viewport height minimum
- `flex items-center` — content is vertically centered
- `py-16` — breathing room when content is taller than 85vh
- `w-full` on inner div — required when parent is flex

Hero uses `min-h-screen` (100vh) instead of `min-h-[85vh]`.

---

## File contents — `apps/web`

### `apps/web/next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
```

### `apps/web/src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* ===================================================
   * BRAND COLOR SYSTEM
   * Change only these 3 values to retheme the entire app.
   *
   * primary   — accent: buttons, badges, highlights, links
   * secondary — dark base: hero bg, footer, dark sections
   * tertiary  — elevated surfaces: cards/panels in dark zones
   * =================================================== */
  --color-primary:   #10b981;
  --color-secondary: #0f172a;
  --color-tertiary:  #1e293b;
}
```

### `apps/web/src/app/layout.js`

```js
import './globals.css'
import Navbar  from '@/components/Navbar'
import Footer  from '@/components/Footer'

export const metadata = {
  title: 'YourBrand',
  description: 'Placeholder app description',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### `apps/web/src/app/page.js`

```js
import Hero         from '@/components/Hero'
import Section1     from '@/components/Section1'
import Section2     from '@/components/Section2'
import Section3     from '@/components/Section3'
import Testimonials from '@/components/Testimonials'
import FAQ          from '@/components/FAQ'

export default function Home() {
  return (
    <main>
      <Hero />
      <Section1 />
      <Section2 />
      <Section3 />
      <Testimonials />
      <FAQ />
    </main>
  )
}
```

### `apps/web/src/sanity/lib/client.js`

```js
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
})
```

---

## File contents — components

### `apps/web/src/components/Navbar.js`

```jsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Blog',      href: '/blog' },
  { label: 'Section 1', href: '/#section1' },
  { label: 'Section 2', href: '/#section2' },
  { label: 'Section 3', href: '/#section3' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b border-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-md" />
            <span className="text-white font-bold text-lg tracking-tight">YourBrand</span>
          </Link>

          {/* Desktop links — plain <a> tags so browser handles hash scrolling natively */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-primary text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block shrink-0">
            <Link
              href="#"
              className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-300 p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-secondary border-t border-tertiary px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-slate-300 hover:text-primary text-sm font-medium py-2.5 transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <Link
              href="#"
              className="block bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center transition-colors"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
```

> **Note:** Nav links use plain `<a>` tags (not Next.js `Link`) so the browser handles `/#section1` anchor scrolling natively from any page, including `/blog`.

### `apps/web/src/components/Footer.js`

```jsx
import Link from 'next/link'

const FOOTER_COLS = [
  {
    heading: 'Navigate',
    links: [
      { label: 'Section 1', href: '/#section1' },
      { label: 'Section 2', href: '/#section2' },
      { label: 'Section 3', href: '/#section3' },
      { label: 'Blog',      href: '/blog' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',   href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press',   href: '#' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Centre', href: '#' },
      { label: 'Contact',     href: '#' },
      { label: 'Status',      href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms',   href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-secondary text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-tertiary">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-md" />
              <span className="text-white font-bold text-base">YourBrand</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Placeholder brand description. One or two sentences about what you do
              and who you do it for.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-white text-sm font-semibold mb-4">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs">
          <p>© {new Date().getFullYear()} YourBrand. All rights reserved.</p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {/* X (Twitter) */}
            <a href="#" aria-label="X" className="w-8 h-8 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-md flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="w-8 h-8 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-md flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" aria-label="GitHub" className="w-8 h-8 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-md flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="w-8 h-8 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-md flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

### `apps/web/src/components/Hero.js`

```jsx
export default function Hero() {
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
```

### `apps/web/src/components/Section1.js`

Two-column layout: copy + feature icon grid on left, placeholder illustration on right. Light background.

```jsx
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
```

### `apps/web/src/components/Section2.js`

Dark background, centered header, 3-column card grid.

```jsx
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
```

### `apps/web/src/components/Section3.js`

Light grey background, centered header, 3-column use-case cards with SVG icons.

```jsx
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

export default function Section3() {
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
            Placeholder subheading for section three. Help visitors self-qualify and
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
```

### `apps/web/src/components/Testimonials.js`

White background, 3-column review cards with star ratings and avatar initials. Hardcoded data.

```jsx
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

export default function Testimonials() {
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
```

### `apps/web/src/components/FAQ.js`

Async server component. Fetches from Sanity. Delegates accordion interactivity to `FAQAccordion`.

```jsx
import { client } from '@/sanity/lib/client'
import FAQAccordion from '@/components/FAQAccordion'

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
```

### `apps/web/src/components/FAQAccordion.js`

Client component. Receives `faqs` array from server parent. One-open-at-a-time accordion.

```jsx
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
```

---

## File contents — blog pages

### `apps/web/src/app/blog/page.js`

Async server component. Fetches all published posts ordered newest-first.

```jsx
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'

const POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, slug, category, excerpt, publishedAt,
  "coverImageUrl": coverImage.asset->url
}`

export const metadata = {
  title: 'Blog | YourBrand',
  description: 'Placeholder blog page',
}

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, { next: { revalidate: 60 } })

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Placeholder blog listing page. Add your posts here.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-400 text-sm">[No Image]</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                  {post.category}
                </span>
                <h2 className="text-slate-900 font-semibold text-lg mt-1 mb-2">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
```

### `apps/web/src/app/blog/[slug]/page.js`

Dynamic detail page. Awaits `params` (required in Next.js 15+). Renders portable text body blocks.

```jsx
import { client } from '@/sanity/lib/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, category, excerpt, publishedAt, body,
  "coverImageUrl": coverImage.asset->url
}`

const ALL_SLUGS_QUERY = `*[_type == "blogPost"] { "slug": slug.current }`

export async function generateStaticParams() {
  const posts = await client.fetch(ALL_SLUGS_QUERY)
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug })
  if (!post) return {}
  return { title: `${post.title} | YourBrand`, description: post.excerpt }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function renderBody(body) {
  if (!body?.length) return null
  return body.map((block) => {
    if (block._type !== 'block') return null
    const text = block.children?.map((c) => c.text).join('') ?? ''
    if (block.style === 'h2') return <h2 key={block._key} className="text-2xl font-bold text-slate-900 mt-8 mb-3">{text}</h2>
    if (block.style === 'h3') return <h3 key={block._key} className="text-xl font-bold text-slate-900 mt-6 mb-2">{text}</h3>
    return <p key={block._key} className="text-slate-600 leading-relaxed mb-4">{text}</p>
  })
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug }, { next: { revalidate: 60 } })
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link href="/blog" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 mb-8">
          ← Back to Blog
        </Link>

        <span className="text-primary text-xs font-semibold uppercase tracking-wide">{post.category}</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">{post.title}</h1>
        <p className="text-slate-400 text-sm mb-8">{formatDate(post.publishedAt)}</p>

        <div className="h-64 bg-slate-100 rounded-xl overflow-hidden relative mb-10">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 text-sm">[No Image]</span>
            </div>
          )}
        </div>

        <div className="prose-sm sm:prose max-w-none">
          {renderBody(post.body)}
        </div>
      </div>
    </main>
  )
}
```

---

## File contents — Sanity schemas

### `apps/studio/schemaTypes/faqItem.ts`

```ts
import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
})
```

### `apps/studio/schemaTypes/blogPost.ts`

```ts
import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on the blog listing page.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  orderings: [
    {
      title: 'Published Date, Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
})
```

### `apps/studio/schemaTypes/index.ts`

```ts
import { faqItem } from './faqItem'
import { blogPost } from './blogPost'

export const schemaTypes = [faqItem, blogPost]
```

---

## Routing map

| URL | File | Type | Data source |
|---|---|---|---|
| `/` | `src/app/page.js` | Server | Static + Sanity (FAQ) |
| `/blog` | `src/app/blog/page.js` | Server | Sanity (`blogPost`) |
| `/blog/[slug]` | `src/app/blog/[slug]/page.js` | Server | Sanity (`blogPost`) |

---

## Customisation guide for agents

### Change brand colors
Edit the 3 variables in `globals.css` `@theme` block. Nothing else needs changing.

### Rename sections
1. Update the `id` attribute on the `<section>` element
2. Update the matching `href` in `NAV_LINKS` in `Navbar.js` and in `FOOTER_COLS` in `Footer.js`

### Replace placeholder text
All hardcoded copy (hero heading, section headings, trust signals, testimonials) is in the respective component files. Replace inline.

### Add a new Sanity content type
1. Create `apps/studio/schemaTypes/myType.ts`
2. Import and add to array in `schemaTypes/index.ts`
3. Fetch with `client.fetch(GROQ_QUERY)` in any server component

### Add a new page
Create `src/app/my-page/page.js` as an async server component. It shares the same Navbar/Footer from `layout.js` automatically.

### Add sections
Follow the section layout pattern. Give each section a unique `id`. Add the component to `page.js` and the corresponding link to `Navbar.js` and `Footer.js`.

---

## Known gotchas

| Gotcha | Fix |
|---|---|
| `params.slug` is undefined | Always `const { slug } = await params` in Next.js 15+ |
| Navbar anchor links don't scroll from other pages | Use plain `<a href="/#section1">` not `<Link>` |
| Sanity images not loading | `cdn.sanity.io` must be in `next.config.mjs` `remotePatterns` |
| `apps/web` missing from `git push` | Nested `.git` in `apps/web` — delete it, then re-add files to parent repo |
| FAQ/blog shows nothing | Documents must be **published** in Sanity, not just drafted |
