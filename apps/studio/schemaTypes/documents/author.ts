import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Author — a first-class E-E-A-T entity. Powers author pages and is injected
 * into Article schema as a Person.
 */
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Photo', type: 'imageWithMeta'}),
    defineField({name: 'role', title: 'Role / Title', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 4}),
    defineField({name: 'expertise', title: 'Areas of Expertise', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({name: 'credentials', title: 'Credentials', type: 'string', description: 'e.g. "Licensed immigration consultant, 10+ years".'}),
    defineField({
      name: 'socials',
      title: 'Social Profiles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({name: 'platform', type: 'string', options: {list: ['twitter', 'linkedin', 'github', 'website', 'youtube', 'instagram']}}),
            defineField({name: 'url', type: 'url', validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'image'}},
})
