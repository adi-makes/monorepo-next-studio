import { createClient } from 'next-sanity'

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

// Only create the client if env vars are present. Otherwise export a stub
// whose fetch() resolves to [] so builds don't crash when Sanity isn't configured
// (e.g. on Vercel before env vars are set).
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : { fetch: async () => [] }
