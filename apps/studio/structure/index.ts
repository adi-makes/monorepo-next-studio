import type {StructureResolver} from 'sanity/structure'

/**
 * Desk structure. Landing page SEO, blog content, redirects,
 * and a Site Settings singleton.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ─── Landing Page SEO ─────────────────────────────────────────────
      S.listItem()
        .title('Landing Pages SEO')
        .schemaType('landingPageSeo')
        .child(S.documentTypeList('landingPageSeo').title('Landing Pages SEO')),

      S.divider(),

      // ─── Blog Content ─────────────────────────────────────────────────
      S.listItem()
        .title('Blog Posts')
        .schemaType('blogPost')
        .child(S.documentTypeList('blogPost').title('Blog Posts')),
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Authors')
        .schemaType('author')
        .child(S.documentTypeList('author').title('Authors')),
      S.listItem()
        .title('FAQ Items')
        .schemaType('faqItem')
        .child(S.documentTypeList('faqItem').title('FAQ Items')),

      S.divider(),

      // ─── SEO & Redirects ──────────────────────────────────────────────
      S.listItem()
        .title('URL Redirects')
        .schemaType('redirect')
        .child(S.documentTypeList('redirect').title('URL Redirects')),

      S.divider(),

      // ─── Site-wide Configuration (Singleton) ─────────────────────────
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
