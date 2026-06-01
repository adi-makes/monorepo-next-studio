import {useFormValue} from 'sanity'

const SITE_ORIGIN = (process.env.SANITY_STUDIO_PREVIEW_URL || 'https://example.com').replace(/^https?:\/\//, '')

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

/**
 * Live Google + social previews. Reads the current document's title / slug /
 * SEO fields and renders search-result, Facebook and Twitter cards.
 */
export function SeoPreview() {
  const title = (useFormValue(['title']) as string) || ''
  const slug = (useFormValue(['slug', 'current']) as string) || ''
  const seo = (useFormValue(['seo']) as Record<string, string>) || {}
  const excerpt = (useFormValue(['excerpt']) as string) || ''
  const type = useFormValue(['_type'])

  const base = type === 'blogPost' ? '/blog/' : '/'
  const url = `${SITE_ORIGIN}${base}${slug}`.replace(/\/+$/, '') || SITE_ORIGIN

  const metaTitle = seo.metaTitle || title || 'Untitled'
  const metaDesc = seo.metaDescription || excerpt || 'No description set.'
  const ogTitle = seo.ogTitle || metaTitle
  const ogDesc = seo.ogDescription || metaDesc

  return (
    <div className="ds-panel ds-seopreview">
      <div className="ds-panel__head">
        <span className="ds-panel__title">Search & Social Preview</span>
      </div>

      <div className="ds-seopreview__group">
        <div className="ds-seopreview__caption">Google</div>
        <div className="ds-google">
          <div className="ds-google__url">{url}</div>
          <div className="ds-google__title">{truncate(metaTitle, 60)}</div>
          <div className="ds-google__desc">{truncate(metaDesc, 160)}</div>
        </div>
      </div>

      <div className="ds-seopreview__group">
        <div className="ds-seopreview__caption">Facebook / OpenGraph</div>
        <div className="ds-social">
          <div className="ds-social__img" />
          <div className="ds-social__body">
            <div className="ds-social__domain">{SITE_ORIGIN}</div>
            <div className="ds-social__title">{truncate(ogTitle, 70)}</div>
            <div className="ds-social__desc">{truncate(ogDesc, 110)}</div>
          </div>
        </div>
      </div>

      <div className="ds-seopreview__group">
        <div className="ds-seopreview__caption">Twitter / X</div>
        <div className="ds-social ds-social--twitter">
          <div className="ds-social__img" />
          <div className="ds-social__body">
            <div className="ds-social__title">{truncate(seo.twitterTitle || ogTitle, 70)}</div>
            <div className="ds-social__desc">{truncate(seo.twitterDescription || ogDesc, 110)}</div>
            <div className="ds-social__domain">{SITE_ORIGIN}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeoPreview
