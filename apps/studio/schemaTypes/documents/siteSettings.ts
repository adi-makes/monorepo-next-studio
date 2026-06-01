import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Site Settings singleton — the top of the inheritance chain and the single
 * place future sites edit instead of code. Controls organisation/website
 * identity plus default SEO, AI SEO, schema, social, and analytics.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'organization', title: 'Organization', default: true},
    {name: 'seo', title: 'Default SEO'},
    {name: 'aiSeo', title: 'Default AI SEO'},
    {name: 'schema', title: 'Default Schema'},
    {name: 'social', title: 'Social'},
    {name: 'integrations', title: 'Integrations'},
  ],
  fields: [
    // Organization / website
    defineField({name: 'name', title: 'Organization / Site Name', type: 'string', group: 'organization', validation: (Rule) => Rule.required()}),
    defineField({name: 'url', title: 'Site URL', type: 'url', group: 'organization', description: 'Production URL, e.g. https://example.com'}),
    defineField({name: 'description', title: 'Organization Description', type: 'text', rows: 2, group: 'organization'}),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithMeta', group: 'organization'}),
    defineField({name: 'legalName', title: 'Legal Name', type: 'string', group: 'organization'}),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'organization',
      validation: (Rule) => Rule.email(),
    }),

    // Default SEO / AI / schema
    defineField({name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo'}),
    defineField({name: 'titleTemplate', title: 'Title Template', type: 'string', group: 'seo', description: 'Use %s for the page title, e.g. "%s | YourBrand".', initialValue: '%s'}),
    defineField({name: 'defaultAiSeo', title: 'Default AI SEO', type: 'aiSeo', group: 'aiSeo'}),
    defineField({name: 'defaultSchemaConfig', title: 'Default Schema', type: 'schemaConfig', group: 'schema'}),

    // Social
    defineField({name: 'socialDefaults', title: 'Social Sharing Defaults', type: 'socialDefaults', group: 'social'}),
    defineField({
      name: 'socialProfiles',
      title: 'Social Profiles',
      type: 'array',
      group: 'social',
      description: 'Used for Organization sameAs links.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'profile',
          fields: [
            defineField({name: 'platform', type: 'string', options: {list: ['twitter', 'linkedin', 'github', 'facebook', 'youtube', 'instagram']}}),
            defineField({name: 'url', type: 'url', validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        }),
      ],
    }),

    // Integrations
    defineField({name: 'analytics', title: 'Analytics', type: 'analyticsConfig', group: 'integrations'}),
    defineField({name: 'search', title: 'Search', type: 'searchIndexSettings', group: 'integrations'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
