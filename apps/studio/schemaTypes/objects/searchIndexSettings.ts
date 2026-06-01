import {defineType, defineField} from 'sanity'

/**
 * Placeholder only — site search is NOT implemented in this pass. Reserved so
 * the data model is ready when search (Algolia / Pagefind / Fuse / Meilisearch)
 * is added later, without a migration.
 */
export const searchIndexSettings = defineType({
  name: 'searchIndexSettings',
  title: 'Search (reserved)',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Algolia', value: 'algolia'},
          {title: 'Pagefind', value: 'pagefind'},
          {title: 'Fuse.js', value: 'fuse'},
          {title: 'Meilisearch', value: 'meilisearch'},
        ],
      },
      initialValue: 'none',
      description: 'Reserved for a future site-search integration.',
    }),
  ],
})
