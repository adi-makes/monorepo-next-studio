import {defineType, defineField, defineArrayMember} from 'sanity'
import {SeoChecklist} from '../components/SeoChecklist'
import {SeoPreview} from '../components/SeoPreview'
import {SchemaPreview} from '../components/SchemaPreview'
import {PreviewPane} from '../components/PreviewPane'

const STATUS_LIST = [
  {title: 'Draft', value: 'draft'},
  {title: 'In Review', value: 'review'},
  {title: 'Approved', value: 'approved'},
  {title: 'Published', value: 'published'},
  {title: 'Archived', value: 'archived'},
]

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'schema', title: 'Schema'},
    {name: 'settings', title: 'Settings'},
    {name: 'preview', title: 'Preview'},
  ],
  fields: [
    // ---- Content ----
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: 'Auto-generated from the title. Click Generate if it is empty.',
    }),
    defineField({
      name: 'oldSlugs',
      title: 'Old Slugs',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      description: 'Managed automatically on publish — old slugs are redirected to the current slug.',
      readOnly: true,
    }),
    defineField({name: 'redirectSettings', title: 'Redirect Settings', type: 'redirectSettings', group: 'content'}),
    defineField({name: 'featuredImage', title: 'Featured Image', type: 'imageWithMeta', group: 'content'}),
    defineField({name: 'tags', title: 'Tags', type: 'array', group: 'content', of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({name: 'tocEnabled', title: 'Show table of contents', type: 'boolean', group: 'content', initialValue: true, hidden: true}),
    defineField({name: 'body', title: 'Body', type: 'portableText', group: 'content'}),
    defineField({name: 'faq', title: 'Post FAQ', type: 'faqList', group: 'content'}),

    // ---- SEO (SEO & Meta + AI SEO merged) ----
    defineField({name: 'seo', title: 'SEO & Meta', type: 'seo', group: 'seo'}),
    defineField({name: 'aiSeo', title: 'AI SEO', type: 'aiSeo', group: 'seo'}),
    defineField({name: 'seoChecklist', title: 'SEO Checklist', type: 'string', group: 'seo', components: {input: SeoChecklist}}),
    defineField({name: 'seoPreview', title: 'Search & Social Preview', type: 'string', group: 'seo', components: {input: SeoPreview}}),

    // ---- Schema ----
    defineField({name: 'schemaPreview', title: 'Schema Preview', type: 'string', group: 'schema', components: {input: SchemaPreview}}),
    defineField({name: 'schemaConfig', title: 'Schema', type: 'schemaConfig', group: 'schema', hidden: true}),

    // ---- Settings ----
    defineField({name: 'author', title: 'Author', type: 'reference', group: 'settings', to: [{type: 'author'}]}),
    defineField({name: 'category', title: 'Category', type: 'reference', group: 'settings', to: [{type: 'category'}]}),
    defineField({name: 'publishedAt', title: 'Published Date', type: 'datetime', group: 'settings', initialValue: () => new Date().toISOString(), validation: (Rule) => Rule.required()}),
    defineField({name: 'updatedAt', title: 'Updated Date', type: 'datetime', group: 'settings', initialValue: () => new Date().toISOString()}),
    defineField({name: 'publishAt', title: 'Publish At (schedule)', type: 'datetime', group: 'settings'}),
    defineField({name: 'unpublishAt', title: 'Unpublish At (schedule)', type: 'datetime', group: 'settings'}),
    defineField({name: 'status', title: 'Status', type: 'string', group: 'settings', options: {list: STATUS_LIST, layout: 'radio'}, initialValue: 'draft'}),
    defineField({name: 'featured', title: 'Featured Post', type: 'boolean', group: 'settings', initialValue: false}),
    defineField({name: 'priority', title: 'Priority', type: 'number', group: 'settings', description: 'Higher sorts first among featured. 0–10.', validation: (Rule) => Rule.min(0).max(10)}),
    defineField({name: 'visibility', title: 'Visible', type: 'boolean', group: 'settings', initialValue: true}),

    // ---- Preview ----
    defineField({name: 'previewPane', title: 'Preview', type: 'string', group: 'preview', components: {input: PreviewPane}}),
  ],
  orderings: [
    {title: 'Published Date, Newest First', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', media: 'featuredImage', category: 'category.name', status: 'status'},
    prepare: ({title, media, category, status}) => ({
      title,
      subtitle: [category, status && status !== 'published' ? status : null].filter(Boolean).join(' · '),
      media,
    }),
  },
})
