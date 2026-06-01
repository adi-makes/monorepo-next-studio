import {defineField, defineType} from 'sanity'

/**
 * Landing Page SEO & Metadata
 *
 * Lightweight document for managing SEO, metadata, and JSON-LD schema for
 * landing pages that are built in code (not CMS-driven content).
 *
 * Examples:
 * - Home page (/en, /es, /fr, etc.)
 * - About page (/about)
 * - Contact page (/contact)
 * - Services page (/services)
 * - Pricing page (/pricing)
 *
 * Editors manage: meta title/description, OG images, canonical URL, schema type,
 * FAQ, quick answer, and speakable content — without touching code.
 */
export const landingPageSeo = defineType({
  name: 'landingPageSeo',
  title: 'Landing Page SEO',
  type: 'document',
  groups: [
    {name: 'content', title: 'Identification & SEO', default: true},
    {name: 'ai', title: 'AI SEO'},
    {name: 'schema', title: 'Schema Config'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    // ─── Identification (group: content) ────────────────────────────────
    defineField({
      name: 'title',
      title: 'Page Title / Identifier',
      description: 'Human-readable name for this landing page (e.g., "Home", "About", "Contact")',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    defineField({
      name: 'slug',
      title: 'Page Slug / Route',
      description:
        'URL path identifier: "/" for homepage, "about" for /about, "contact" for /contact, etc. (no slashes)',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    // ─── SEO & Metadata (group: content) ────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO & Meta Tags',
      description: 'Meta title, description, canonical URL, OG image, Twitter card, robots directives',
      type: 'seo',
      group: 'content',
    }),

    // ─── AI SEO (group: ai) ─────────────────────────────────────────────
    defineField({
      name: 'aiSeo',
      title: 'AI SEO',
      description: 'Quick answer, summary, key takeaways, speakable content for voice search',
      type: 'aiSeo',
      group: 'ai',
    }),

    // ─── Schema Config (group: schema) ──────────────────────────────────
    defineField({
      name: 'schemaConfig',
      title: 'JSON-LD Schema',
      description:
        'Configure which structured data schemas to generate: Organization, WebSite, LocalBusiness, FAQPage, BreadcrumbList, etc.',
      type: 'schemaConfig',
      group: 'schema',
    }),

    // ─── Optional FAQ (group: schema) ───────────────────────────────────
    defineField({
      name: 'faq',
      title: 'FAQ Items (Optional)',
      description: 'Add FAQ items for this landing page. If provided, FAQPage schema will be generated.',
      type: 'faqList',
      group: 'schema',
    }),

    // ─── Settings (group: settings) ────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'settings',
    }),

    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      description: 'Last modified date (updated automatically when published)',
      type: 'datetime',
      group: 'settings',
    }),

    defineField({
      name: 'visibility',
      title: 'Visibility',
      description: 'Public or hidden from search (robots directives)',
      type: 'string',
      options: {
        list: [
          {title: 'Public (index, follow)', value: 'public'},
          {title: 'Hidden (noindex, nofollow)', value: 'hidden'},
        ],
      },
      initialValue: 'public',
      group: 'settings',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      visibility: 'visibility',
    },
    prepare({title, slug, visibility}) {
      const icon = visibility === 'hidden' ? '🚫' : '✅'
      return {
        title: `${icon} ${title}`,
        subtitle: `/${slug === '/' ? '' : slug}`,
      }
    },
  },
})
