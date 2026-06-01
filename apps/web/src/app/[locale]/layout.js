// ============================================================================
// Root layout — owns <html>/<body>. Injects site-wide JSON-LD (Organization +
// WebSite) and analytics from Sanity Site Settings, and enables Visual Editing
// + a draft banner when Next.js Draft Mode is on.
// ============================================================================

import {notFound} from 'next/navigation'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import '../globals.css'

import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import JsonLd from '@/components/shared/JsonLd'
import DraftModeBanner from '@/components/shared/DraftModeBanner'
import {Analytics} from '@/analytics'

import {LOCALES} from '@/i18n/config'
import {isValidLocale, isRtlLocale} from '@/i18n/utils'
import {sanityFetch} from '@/sanity/lib/fetch'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {generateOrganizationSchema, generateWebsiteSchema} from '@/schema'
import {buildMetadata} from '@/seo'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({locale}))
}

export async function generateMetadata({params}) {
  const {locale} = await params
  const settings = (await sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']})) || {}
  return buildMetadata({settings, doc: {title: settings.name}, path: '/', locale, type: 'website'})
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params
  if (!isValidLocale(locale)) notFound()

  const [settings, draft] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    draftMode(),
  ])
  const s = settings || {}
  const brand = s.name

  return (
    <html lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-slate-900 font-sans antialiased"
      >
        {draft.isEnabled ? <DraftModeBanner /> : null}
        <JsonLd data={[generateOrganizationSchema(s), generateWebsiteSchema(s)]} />
        <Navbar locale={locale} brand={brand} />
        {children}
        <Footer locale={locale} brand={brand} description={s.description} socialProfiles={s.socialProfiles} />
        <Analytics analytics={s.analytics} />
        {draft.isEnabled ? <VisualEditing /> : null}
      </body>
    </html>
  )
}
