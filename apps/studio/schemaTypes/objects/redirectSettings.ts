import {defineType, defineField} from 'sanity'

/**
 * Per-document redirect behaviour for slug history. When enabled, requests to
 * a document's old slugs are redirected to the current slug by the frontend.
 */
export const redirectSettings = defineType({
  name: 'redirectSettings',
  title: 'Redirect Settings',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'enabled',
      title: 'Redirect old slugs to current slug',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      initialValue: true,
      description: 'On = 301 (permanent). Off = 302 (temporary).',
    }),
  ],
})
