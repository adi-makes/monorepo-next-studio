// ============================================================================
// Root layout — lives at /app/[locale]/layout.js, not /app/layout.js
// ----------------------------------------------------------------------------
// With every page nested under the [locale] dynamic segment, this IS the root
// layout (the one that owns <html> and <body>). Middleware ensures no request
// ever reaches the app without passing through here.
//
// Adding a locale later is purely additive:
//   - LOCALES.push('fr') in i18n/config.js
//   - generateStaticParams() below picks it up automatically
//   - middleware will start routing /fr/* without changes
// ============================================================================

import { notFound } from 'next/navigation'
import '../globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LOCALES } from '@/i18n/config'
import { isValidLocale, isRtlLocale } from '@/i18n/utils'

export const metadata = {
  title: 'YourBrand',
  description: 'Placeholder app description',
}

/**
 * Tell Next.js which locale folders to prerender at build time.
 * Returns [{ locale: 'en' }] today; grows automatically with LOCALES.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }) {
  // Next.js 15+: params is async.
  const { locale } = await params

  // Defensive 404: middleware already rejects unknown locales, but if a
  // request reaches this layout with a junk value (stale cached link, manual
  // typing, bypassed middleware in a test) we want a clean 404 rather than
  // rendering with garbage.
  if (!isValidLocale(locale)) notFound()

  return (
    <html lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-slate-900 font-sans antialiased"
      >
        <Navbar locale={locale} />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  )
}
