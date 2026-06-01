import {defineType, defineField} from 'sanity'

/**
 * Category — second level of the inheritance chain. Provides SEO, AI SEO,
 * schema, FAQ and social defaults that posts inherit unless they override.
 */
export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'defaults', title: 'Defaults (inherited by posts)'},
  ],
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', group: 'content', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'content', options: {source: 'name', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'image', title: 'Image', type: 'imageWithMeta', group: 'content'}),

    defineField({name: 'seoDefaults', title: 'SEO Defaults', type: 'seo', group: 'defaults'}),
    defineField({name: 'aiSeoDefaults', title: 'AI SEO Defaults', type: 'aiSeo', group: 'defaults'}),
    defineField({name: 'schemaDefaults', title: 'Schema Defaults', type: 'schemaConfig', group: 'defaults'}),
    defineField({name: 'faqDefaults', title: 'FAQ Defaults', type: 'faqList', group: 'defaults'}),
    defineField({name: 'socialDefaults', title: 'Social Defaults', type: 'socialDefaults', group: 'defaults'}),
  ],
  preview: {select: {title: 'name', subtitle: 'slug.current', media: 'image'}},
})
