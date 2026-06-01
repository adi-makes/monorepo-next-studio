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
    {name: 'seo', title: 'SEO & Meta'},
    {name: 'aiSeo', title: 'AI SEO'},
    {name: 'schema', title: 'Schema'},
    {name: 'settings', title: 'Settings'},
    {name: 'preview', title: 'Preview'},
  ],
  fields: [
    // ---- Content ----
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'content', options: {source: 'title', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, group: 'content', description: 'Short summary shown on listings and used as a meta fallback.', validation: (Rule) => Rule.max(300)}),
    defineField({name: 'featuredImage', title: 'Featured Image', type: 'imageWithMeta', group: 'content'}),
    defineField({name: 'author', title: 'Author', type: 'reference', group: 'content', to: [{type: 'author'}]}),
    defineField({name: 'category', title: 'Category', type: 'reference', group: 'content', to: [{type: 'category'}]}),
    defineField({name: 'tags', title: 'Tags', type: 'array', group: 'content', of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({name: 'tocEnabled', title: 'Show table of contents', type: 'boolean', group: 'content', initialValue: true}),
    defineField({name: 'body', title: 'Body', type: 'portableText', group: 'content'}),
    defineField({name: 'faq', title: 'Post FAQ', type: 'faqList', group: 'content'}),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: [{type: 'blogPost'}]})],
      validation: (Rule) => Rule.unique().max(3),
    }),

    // ---- SEO ----
    defineField({name: 'seoPreview', title: 'Search & Social Preview', type: 'string', group: 'seo', components: {input: SeoPreview}}),
    defineField({name: 'seoChecklist', title: 'SEO Checklist', type: 'string', group: 'seo', components: {input: SeoChecklist}}),
    defineField({name: 'seo', title: 'SEO & Meta', type: 'seo', group: 'seo'}),

    // ---- AI SEO ----
    defineField({name: 'aiSeo', title: 'AI SEO', type: 'aiSeo', group: 'aiSeo'}),

    // ---- Schema ----
    defineField({name: 'schemaPreview', title: 'Schema Preview', type: 'string', group: 'schema', components: {input: SchemaPreview}}),
    defineField({name: 'schemaConfig', title: 'Schema', type: 'schemaConfig', group: 'schema'}),

    // ---- Settings ----
    defineField({name: 'publishedAt', title: 'Published Date', type: 'datetime', group: 'settings', initialValue: () => new Date().toISOString(), validation: (Rule) => Rule.required()}),
    defineField({name: 'updatedAt', title: 'Updated Date', type: 'datetime', group: 'settings'}),
    defineField({name: 'publishAt', title: 'Publish At (schedule)', type: 'datetime', group: 'settings'}),
    defineField({name: 'unpublishAt', title: 'Unpublish At (schedule)', type: 'datetime', group: 'settings'}),
    defineField({name: 'status', title: 'Status', type: 'string', group: 'settings', options: {list: STATUS_LIST, layout: 'radio'}, initialValue: 'draft'}),
    defineField({name: 'featured', title: 'Featured Post', type: 'boolean', group: 'settings', initialValue: false}),
    defineField({name: 'priority', title: 'Priority', type: 'number', group: 'settings', description: 'Higher sorts first among featured. 0–10.', validation: (Rule) => Rule.min(0).max(10)}),
    defineField({name: 'visibility', title: 'Visible', type: 'boolean', group: 'settings', initialValue: true}),
    defineField({name: 'oldSlugs', title: 'Old Slugs', type: 'array', group: 'settings', of: [{type: 'string'}], description: 'Managed automatically on publish — redirected to the current slug.', readOnly: true}),
    defineField({name: 'redirectSettings', title: 'Redirect Settings', type: 'redirectSettings', group: 'settings'}),

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
