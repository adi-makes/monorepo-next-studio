// ============================================================================
// Locale proxy (Next.js 16's renamed middleware)
// ----------------------------------------------------------------------------
// Lives at /src/proxy.js. Next.js 16 deprecated the `middleware` file
// convention in favor of `proxy` — same runtime, same Edge environment, same
// matcher syntax. The exported function must be named `proxy` (or default).
//
// Runs on every request that isn't a Next.js internal asset or API route
// (see `matcher` below). Two responsibilities:
//
//   1. If the first path segment is an active locale, do nothing — the
//      request proceeds to /app/[locale]/... as written.
//   2. Otherwise, redirect to the same path under DEFAULT_LOCALE.
//        /            -> /en
//        /blog        -> /en/blog
//        /blog/foo    -> /en/blog/foo
//
// Once new codes are added to LOCALES (e.g. 'fr'), this same logic routes
// '/fr/...' correctly with no edits. To layer in Accept-Language detection
// later, extend pickLocale() — keep the rest as-is.
// ============================================================================

import { NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from './i18n/config'

/**
 * Decide which locale to redirect an un-prefixed request to.
 * MVP: always DEFAULT_LOCALE. Future hook: read accept-language, cookies, etc.
 */
function pickLocale(/* request */) {
  return DEFAULT_LOCALE
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocalePrefix) return

  const locale = pickLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Skip Next internals, the api/ tree, and any path that looks like a file
  // (has an extension — favicon.ico, robots.txt, sitemap.xml, images, etc).
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
