// ============================================================================
// Image helpers. Queries dereference `asset->url` + metadata (see fragments),
// so here we just decorate the CDN URL with Sanity's transform query params —
// no @sanity/image-url dependency required.
// ============================================================================

/**
 * @typedef {Object} SanityImage
 * @property {string} [url]
 * @property {string} [alt]
 * @property {string} [lqip]
 * @property {{width:number,height:number,aspectRatio:number}} [dimensions]
 */

/**
 * Build a transformed Sanity CDN URL.
 * @param {SanityImage|string|null|undefined} image
 * @param {{width?:number,height?:number,quality?:number,fit?:string}} [opts]
 * @returns {string|null}
 */
export function imageUrl(image, opts = {}) {
  const base = typeof image === 'string' ? image : image?.url
  if (!base) return null
  const {width, height, quality = 75, fit = 'max'} = opts
  try {
    const u = new URL(base)
    if (width) u.searchParams.set('w', String(Math.round(width)))
    if (height) u.searchParams.set('h', String(Math.round(height)))
    u.searchParams.set('q', String(quality))
    u.searchParams.set('fit', fit)
    u.searchParams.set('auto', 'format')
    return u.toString()
  } catch {
    return base
  }
}

/**
 * Convenience accessor for alt text.
 * @param {SanityImage|null|undefined} image
 * @returns {string}
 */
export function imageAlt(image) {
  return image?.alt || ''
}
