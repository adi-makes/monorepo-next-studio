// =============================================================================
// Navbar — top navigation bar. Brand name comes from Sanity Site Settings.
// Add new nav links here. The component is a Client Component ('use client')
// to allow future interactive behaviours (mobile menu, dropdowns).
// =============================================================================

'use client'
import Link from 'next/link'
import { localizedPath } from '@/i18n/routing'

export default function Navbar({ locale, brand = 'YourBrand' }) {
  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b border-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href={localizedPath(locale, '/')} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-md" />
            <span className="text-white font-bold text-lg tracking-tight">{brand}</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href={localizedPath(locale, '/#faq')} className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">
              FAQ
            </Link>
            <Link href={localizedPath(locale, '/blog')} className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">
              Blog
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}
