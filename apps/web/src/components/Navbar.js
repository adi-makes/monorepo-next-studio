'use client'
import { useState } from 'react'
import Link from 'next/link'
import { localizedPath } from '@/i18n/routing'

/**
 * Locale-aware navbar.
 *
 * The `locale` prop is plumbed down from the root layout (which reads it from
 * route params). All internal hrefs are built through localizedPath() so they
 * never bypass the [locale] segment — that keeps URLs canonical and avoids an
 * extra middleware redirect on every click.
 *
 * Plain <a> tags are used for in-page anchors (Section 1/2/3) so the browser
 * handles hash scrolling natively even when navigating across pages.
 */
export default function Navbar({ locale }) {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Home',      href: localizedPath(locale, '/') },
    { label: 'Blog',      href: localizedPath(locale, '/blog') },
    { label: 'Section 1', href: localizedPath(locale, '/#section1') },
    { label: 'Section 2', href: localizedPath(locale, '/#section2') },
    { label: 'Section 3', href: localizedPath(locale, '/#section3') },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b border-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={localizedPath(locale, '/')} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-md" />
            <span className="text-white font-bold text-lg tracking-tight">YourBrand</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => (
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
          {links.map((link) => (
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
