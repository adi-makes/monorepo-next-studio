import {SITE_URL, SITE_NAME} from '@/constants/site'

const CONTEXT = 'https://schema.org'

/**
 * WebSite JSON-LD.
 * @param {any} settings
 */
export function generateWebsiteSchema(settings = {}) {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: settings.name || SITE_NAME,
    url: settings.url || SITE_URL,
  }
}
