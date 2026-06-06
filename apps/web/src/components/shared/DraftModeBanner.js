// =============================================================================
// DraftModeBanner — sticky top banner shown only in draft/preview mode.
// Rendered by layout.js when draftMode().isEnabled is true.
// The "exit preview" link calls /api/draft-mode/disable which clears the cookie.
// =============================================================================

/**
 * Shown only when Next.js Draft Mode is enabled (preview). Links to the
 * disable route to exit preview.
 */
export default function DraftModeBanner() {
  return (
    <div className="sanity-draft-banner">
      Draft preview mode —{' '}
      {/* Full navigation to an API route (clears draft mode + redirects). Not a page — Link would break it. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/draft-mode/disable">
        exit preview
      </a>
    </div>
  )
}
