// =============================================================================
// hreflang helpers — builds the `alternates.languages` map for every active
// locale. Injected into every page's Metadata so Google knows about locale
// variants. Add new locales in src/i18n/config.js to extend coverage.
// =============================================================================

import {LOCALES} from '@/i18n/config'
import {localizedPath} from '@/i18n/routing'
import {SITE_URL} from '@/constants/site'

/**
 * Build `alternates.languages` for hreflang from every active locale.
 * @param {string} path Locale-less path, e.g. "/blog/foo"
 * @returns {Record<string,string>}
 */
export function buildLanguageAlternates(path = '/') {
  /** @type {Record<string,string>} */
  const languages = {}
  for (const locale of LOCALES) {
    languages[locale] = `${SITE_URL}${localizedPath(locale, path)}`
  }
  languages['x-default'] = `${SITE_URL}${localizedPath(LOCALES[0], path)}`
  return languages
}
