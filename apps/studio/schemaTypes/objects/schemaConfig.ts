import {defineType, defineField} from 'sanity'

/**
 * Structured-data (JSON-LD) configuration. Embedded on documents and as
 * defaults on Category and Site Settings, so schema behaviour inherits
 * Site -> Category -> Document.
 *
 * Booleans are intentionally left without an initialValue so "unset" means
 * "inherit from the level above". Only `enableBreadcrumb` defaults on because
 * breadcrumbs are near-universally desirable.
 */
export const PRIMARY_SCHEMA_TYPES = [
  {title: 'Article', value: 'article'},
  {title: 'BlogPosting', value: 'blogPosting'},
  {title: 'HowTo', value: 'howTo'},
  {title: 'Product', value: 'product'},
  {title: 'Review', value: 'review'},
  {title: 'WebPage', value: 'webPage'},
]

export const schemaConfig = defineType({
  name: 'schemaConfig',
  title: 'Schema',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'primarySchemaType',
      title: 'Primary Schema Type',
      type: 'string',
      options: {list: PRIMARY_SCHEMA_TYPES, layout: 'dropdown'},
      description: 'Main entity type. Inherited from category / site when unset.',
    }),
    defineField({name: 'enableFaqSchema', title: 'FAQ Schema', type: 'boolean'}),
    defineField({name: 'enableSpeakable', title: 'Speakable Schema', type: 'boolean'}),
    defineField({name: 'enableBreadcrumb', title: 'Breadcrumb Schema', type: 'boolean', initialValue: true}),
    defineField({
      name: 'enableVideoSchema',
      title: 'Video Schema',
      type: 'boolean',
      description: 'Auto-emitted from YouTube / video blocks when enabled.',
    }),
    defineField({name: 'enableImageSchema', title: 'Image Schema', type: 'boolean'}),
  ],
})
