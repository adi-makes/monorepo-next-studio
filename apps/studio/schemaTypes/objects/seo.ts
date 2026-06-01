import {defineType, defineField} from 'sanity'
import {createCharacterCount} from '../components/CharacterCount'

/**
 * Reusable SEO & meta object. Embedded on documents, and as defaults on
 * Site Settings and Category (inheritance: Site -> Category -> Document).
 * Meta title / description show live character counters with warn/error states.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO & Meta',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      components: {input: createCharacterCount({recommendedMin: 50, recommendedMax: 60, hardLimit: 70})},
      validation: (Rule) =>
        Rule.max(70).warning('Over 70 characters will be truncated by Google'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      components: {input: createCharacterCount({recommendedMin: 140, recommendedMax: 160, hardLimit: 180})},
      validation: (Rule) =>
        Rule.max(180).warning('Over 180 characters will be truncated by Google'),
    }),
    defineField({name: 'canonicalUrl', title: 'Canonical URL', type: 'url'}),

    defineField({name: 'ogTitle', title: 'OpenGraph Title', type: 'string'}),
    defineField({name: 'ogDescription', title: 'OpenGraph Description', type: 'text', rows: 2}),
    defineField({name: 'ogImage', title: 'OpenGraph Image', type: 'imageWithMeta'}),

    defineField({name: 'twitterTitle', title: 'Twitter Title', type: 'string'}),
    defineField({name: 'twitterDescription', title: 'Twitter Description', type: 'text', rows: 2}),
    defineField({name: 'twitterImage', title: 'Twitter Image', type: 'imageWithMeta'}),

    defineField({
      name: 'robots',
      title: 'Robots Directives',
      type: 'object',
      options: {columns: 2},
      fields: [
        defineField({name: 'noindex', title: 'No-index', type: 'boolean'}),
        defineField({name: 'nofollow', title: 'No-follow', type: 'boolean'}),
      ],
    }),
  ],
})
