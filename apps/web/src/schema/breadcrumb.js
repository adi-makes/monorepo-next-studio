const CONTEXT = 'https://schema.org'

/**
 * BreadcrumbList JSON-LD.
 * @param {{name:string,url:string}[]} items
 */
export function generateBreadcrumbSchema(items = []) {
  if (!items.length) return null
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
