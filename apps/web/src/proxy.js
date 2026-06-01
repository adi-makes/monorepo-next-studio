// ============================================================================
// Locale proxy (Next.js 16's renamed middleware) + redirect management.
// ----------------------------------------------------------------------------
// Two responsibilities, in order:
//
//   1. Editor-managed redirects (Sanity `redirect` docs). Best-effort: looked
//      up against a short-lived in-memory cache. The reliable slug-history path
//      is the per-document `oldSlugs` handling inside the page routes.
//   2. Locale prefixing — ensure every request lands under /<locale>/...
// ============================================================================

import {NextResponse} from 'next/server'
import {LOCALES, DEFAULT_LOCALE} from './i18n/config'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// --- redirect cache ---------------------------------------------------------
const REDIRECT_TTL = 60_000
let redirectCache = {at: 0, data: []}

async function getRedirects() {
  if (!projectId) return []
  const now = Date.now()
  if (now - redirectCache.at < REDIRECT_TTL) return redirectCache.data
  try {
    const query = '*[_type=="redirect" && enabled==true]{source,destination,"permanent":coalesce(permanent,true)}'
    const url = `https://${projectId}.apicdn.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`
    const res = await fetch(url)
    const json = await res.json()
    redirectCache = {at: now, data: Array.isArray(json.result) ? json.result : []}
  } catch {
    redirectCache = {at: now, data: redirectCache.data}
  }
  return redirectCache.data
}

function localeOf(pathname) {
  const seg = pathname.split('/')[1]
  return LOCALES.includes(seg) ? seg : null
}

function stripLocale(pathname) {
  const locale = localeOf(pathname)
  if (!locale) return pathname
  const rest = pathname.slice(locale.length + 1)
  return rest || '/'
}

export async function proxy(request) {
  const {pathname} = request.nextUrl

  // 1. Editor-managed redirects (match against the locale-less path).
  const barePath = stripLocale(pathname).replace(/\/+$/, '') || '/'
  const redirects = await getRedirects()
  const hit = redirects.find((r) => r.source?.replace(/\/+$/, '') === barePath && barePath !== '/')
  if (hit) {
    const locale = localeOf(pathname) || DEFAULT_LOCALE
    const dest = /^https?:\/\//.test(hit.destination)
      ? hit.destination
      : `/${locale}${hit.destination.startsWith('/') ? '' : '/'}${hit.destination}`
    const url = request.nextUrl.clone()
    if (/^https?:\/\//.test(dest)) return NextResponse.redirect(dest, hit.permanent ? 308 : 307)
    url.pathname = dest
    return NextResponse.redirect(url, hit.permanent ? 308 : 307)
  }

  // 2. Locale prefixing.
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocalePrefix) return

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
