import {defineType, defineField} from 'sanity'

/**
 * Social-sharing defaults. Embedded on Site Settings and Category so OG/Twitter
 * imagery and handles inherit when a document doesn't override them.
 */
export const socialDefaults = defineType({
  name: 'socialDefaults',
  title: 'Social Sharing Defaults',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'ogImage', title: 'Default OpenGraph Image', type: 'imageWithMeta'}),
    defineField({name: 'twitterImage', title: 'Default Twitter Image', type: 'imageWithMeta'}),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter / X Handle',
      type: 'string',
      description: 'Including the @, e.g. @yourbrand',
    }),
  ],
})
