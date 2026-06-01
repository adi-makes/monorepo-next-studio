import {revalidateTag} from 'next/cache'
import {parseBody} from 'next-sanity/webhook'

// ============================================================================
// Sanity webhook -> on-demand revalidation. Configure a webhook in Sanity that
// POSTs here with a GROQ projection of `{_type, "slug": slug.current}` and the
// shared secret SANITY_REVALIDATE_SECRET. Content updates appear without a
// redeploy. All content types are tagged by `_type` in sanityFetch().
// ============================================================================

export async function POST(request) {
  try {
    const {isValidSignature, body} = await parseBody(request, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return new Response(JSON.stringify({message: 'Invalid signature'}), {status: 401})
    }

    const type = body?._type
    if (!type) {
      return new Response(JSON.stringify({message: 'Bad request: missing _type'}), {status: 400})
    }

    revalidateTag(type)
    const slug = body?.slug?.current || body?.slug
    if (slug) revalidateTag(`${type}:${slug}`)

    return Response.json({revalidated: true, type, slug: slug || null, now: Date.now()})
  } catch (err) {
    console.error('[revalidate] error:', err)
    return new Response(JSON.stringify({message: 'Error revalidating'}), {status: 500})
  }
}
