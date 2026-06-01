// ============================================================================
// Search layer — RESERVED placeholder. Site search is not implemented in this
// pass (per project scope). The data model (siteSettings.search) and this entry
// point exist so a provider (Algolia / Pagefind / Fuse.js / Meilisearch) can be
// added later without restructuring.
// ============================================================================

export const SEARCH_ENABLED = false

/**
 * @param {any} settings Site Settings
 * @returns {{provider:string}}
 */
export function getSearchConfig(settings) {
  return settings?.search || {provider: 'none'}
}
