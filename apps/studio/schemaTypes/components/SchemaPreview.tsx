import {useFormValue} from 'sanity'

const DEFAULT_PRIMARY: Record<string, string> = {
  blogPost: 'BlogPosting',
  page: 'WebPage',
}

/**
 * Shows which JSON-LD schemas this document will emit, based on its schema
 * config. Organization + WebSite are always emitted site-wide. Note that
 * category / site defaults can enable more at render time.
 */
export function SchemaPreview() {
  const type = useFormValue(['_type']) as string
  const cfg = (useFormValue(['schemaConfig']) as Record<string, unknown>) || {}
  const faq = useFormValue(['faq']) as unknown[] | undefined
  const author = useFormValue(['author'])
  const body = useFormValue(['body']) as Array<{_type?: string}> | undefined

  const primary = (cfg.primarySchemaType as string) || DEFAULT_PRIMARY[type] || 'WebPage'
  const hasFaq = Array.isArray(faq) && faq.length > 0
  const hasVideo = Array.isArray(body) && body.some((b) => b?._type === 'youtube')

  const schemas: Array<{name: string; on: boolean; note?: string}> = [
    {name: primary, on: true, note: 'primary'},
    {name: 'BreadcrumbList', on: cfg.enableBreadcrumb !== false},
    {name: 'FAQPage', on: Boolean(cfg.enableFaqSchema) || hasFaq},
    {name: 'SpeakableSpecification', on: Boolean(cfg.enableSpeakable)},
    {name: 'Person (author)', on: Boolean(author)},
    {name: 'VideoObject', on: Boolean(cfg.enableVideoSchema) && hasVideo},
    {name: 'Organization', on: true, note: 'site-wide'},
    {name: 'WebSite', on: true, note: 'site-wide'},
  ]

  return (
    <div className="ds-panel ds-schemapreview">
      <div className="ds-panel__head">
        <span className="ds-panel__title">Schema Output</span>
      </div>
      <ul className="ds-schemapreview__list">
        {schemas.map((s) => (
          <li key={s.name} className="ds-schemapreview__item" data-on={s.on}>
            <span className="ds-badge" data-state={s.on ? 'ok' : 'off'}>
              {s.on ? 'JSON-LD' : 'off'}
            </span>
            <span className="ds-schemapreview__name">{s.name}</span>
            {s.note ? <span className="ds-schemapreview__note">{s.note}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SchemaPreview
