// ============================================================================
// i18n configuration — single source of truth
// ----------------------------------------------------------------------------
// To enable a new locale later:
//   1. Add its code to LOCALES below (e.g. 'fr').
//   2. Add a human-readable label to LOCALE_LABELS.
//   3. If it reads right-to-left, add it to RTL_LOCALES.
// Nothing else needs to change — middleware, layout, helpers all read from
// this file and adapt automatically.
//
// Only 'en' is active during the MVP. The rest are listed in LOCALE_LABELS
// for reference but are NOT in LOCALES, so the middleware will not route to
// them yet.
// ============================================================================

/**
 * @typedef {(typeof LOCALES)[number]} Locale
 * Compile-time union of every active locale code. Editor IntelliSense and
 * `tsc --checkJs` narrow this automatically — when LOCALES grows, Locale grows.
 */

/** Active locales the site currently serves. */
export const LOCALES = /** @type {const} */ (['en'])

/** Fallback used when no locale can be detected or an invalid one is requested. */
export const DEFAULT_LOCALE = 'en'

/** Display names used by future locale switcher UIs. */
export const LOCALE_LABELS = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
}

/** Locales that render right-to-left. Drives the <html dir> attribute. */
export const RTL_LOCALES = ['ar']
