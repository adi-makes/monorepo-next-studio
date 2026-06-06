# Next.js + Sanity Fullstack Template

A production-ready, CMS-driven website template built on **Next.js 16** (App Router) and **Sanity Studio v5**. Designed to be handed off to any developer team — everything is auto-detected, minimal manual configuration is needed, and every file is commented.

> **Package manager: npm only.** This repo uses npm workspaces. Never run `yarn`, `pnpm`, or `bun` — if you see a `pnpm-lock.yaml` file, delete it and run `npm install`.

---

## Table of Contents

1. [What This Is](#1-what-this-is)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Quick Start](#4-quick-start)
5. [Environment Variables](#5-environment-variables)
6. [Architecture](#6-architecture)
7. [Color System (Theming)](#7-color-system-theming)
8. [Localization](#8-localization)
9. [SEO System](#9-seo-system)
10. [JSON-LD Schema Auto-Detection](#10-json-ld-schema-auto-detection)
11. [Analytics](#11-analytics)
12. [Draft Preview](#12-draft-preview)
13. [On-Demand Revalidation (Webhooks)](#13-on-demand-revalidation-webhooks)
14. [Routing Map](#14-routing-map)
15. [How To: Common Tasks](#15-how-to-common-tasks)
16. [Sanity Studio Reference](#16-sanity-studio-reference)
17. [Deployment](#17-deployment)
18. [Command Reference](#18-command-reference)
19. [Known Gotchas](#19-known-gotchas)

---

## 1. What This Is

A two-app npm-workspace monorepo:

- **`apps/web`** — Next.js 16 frontend. Landing pages, full blog system (listing, post, category, author), FAQ page, and API routes. All SEO, schema, and analytics are CMS-controlled.
- **`apps/studio`** — Sanity Studio v5 CMS. Editors manage content, metadata, FAQ items, redirects, and analytics credentials — no code changes needed.

### Core principles

| Principle | How it works |
|-----------|-------------|
| Code renders, Sanity controls | Page *content* is React JSX (version-controlled, reviewed as PRs). Page *SEO metadata* is in Sanity (editors can update without deploys). |
| Auto-detected schemas | JSON-LD is emitted automatically from content. Editors don't configure schema types — the code detects them. |
| Minimal Sanity inputs | The CMS has only the fields editors actually need. Boilerplate config is eliminated. |
| One inheritance chain | `Site Settings → Document`. Set SEO once at the top; override only where needed. |
| Ready for any team | Every file is commented. The README explains every decision. A developer can be productive in under an hour. |

### Features

| Feature | Details |
|---------|---------|
| Blog system | Posts, categories, authors — fully managed in Sanity |
| Landing pages | Content in code, SEO/schema/FAQ in Sanity |
| JSON-LD schemas | Auto-detected: BlogPosting, FAQPage, HowTo, BreadcrumbList, Organization, WebSite, Person, Service, VideoObject, SpeakableSpecification |
| E-E-A-T signals | Author Person schema with jobTitle, worksFor, sameAs social links |
| AI SEO | Quick Answer (speakable), Key Takeaways — targets Google AI Overviews and voice search |
| Draft preview | Sanity Presentation tool + Next.js Draft Mode cookies |
| On-demand ISR | Sanity webhook → `/api/revalidate` → cache purged in seconds |
| Multi-language routing | `[locale]` URL segment — add a language in one line |
| CMS redirects | Editor-managed 301/302 redirects applied at the edge |
| Analytics | GA4, GTM, Plausible, Clarity — configure IDs in Sanity, zero code |
| Accessible | Skip navigation, ARIA accordion, mobile nav, landmark regions |
| Performance | LCP priority images, lazy body images, CDN preconnect, LQIP blur placeholders |

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.6 — App Router, RSC |
| Language (web) | JavaScript | — JSDoc `@typedef` for types, no TypeScript toolchain needed |
| Language (studio) | TypeScript | ^5.8 — required by Sanity |
| Styling | Tailwind CSS | v4 — `@import "tailwindcss"` + `@theme` block |
| CMS client | next-sanity | ^13 — wraps Sanity client with ISR |
| CMS | Sanity Studio | v5 |
| Icons | lucide-react | — blog components + UI |
| Dev runner | concurrently | ^9 — runs both apps in parallel |
| **Package manager** | **npm** | **— npm workspaces only. Never use pnpm/yarn/bun** |

---

## 3. Directory Structure

```
monorepo/
├── package.json              ← npm workspaces root: shared scripts, concurrently
├── package-lock.json         ← Auto-generated; never edit manually
├── .gitignore                ← Covers both apps
├── README.md                 ← This file
└── apps/
    ├── web/                  ← Next.js 16 frontend (JavaScript)
    │   ├── .env.example      ← Committed template — safe to share
    │   ├── .env.local        ← Real secrets — gitignored, NEVER commit
    │   ├── next.config.mjs   ← Image CDN config (cdn.sanity.io allowed)
    │   ├── jsconfig.json     ← Path alias: @/* → ./src/*
    │   ├── postcss.config.mjs
    │   ├── eslint.config.mjs
    │   └── src/
    │       ├── proxy.js              ← Next.js 16 edge proxy: locale redirect + CMS redirects
    │       ├── analytics/
    │       │   └── index.js          ← GA4, GTM, Plausible, Clarity — CMS-driven
    │       ├── app/
    │       │   ├── globals.css       ← Tailwind v4 import + 3-variable brand theme
    │       │   ├── robots.js         ← /robots.txt
    │       │   ├── sitemap.js        ← /sitemap.xml (dynamic, from Sanity)
    │       │   └── [locale]/         ← ALL routes live under this segment
    │       │       ├── layout.js     ← Root layout: <html>, Navbar, Footer, JSON-LD, skip nav
    │       │       ├── page.js       ← Homepage
    │       │       ├── faq/page.js   ← FAQ page
    │       │       ├── blog/
    │       │       │   ├── page.js                   ← Blog listing + category chips
    │       │       │   ├── [slug]/page.js             ← Blog post detail
    │       │       │   └── category/[slug]/page.js   ← Category archive
    │       │       └── author/
    │       │           └── [slug]/page.js             ← Author profile + posts
    │       ├── components/
    │       │   ├── blog/             ← Blog-specific components
    │       │   │   ├── AuthorCard.js       ← Compact byline OR full profile card
    │       │   │   ├── BlogCard.js         ← Post preview card (cover, title, excerpt)
    │       │   │   ├── BlogEmptyState.js   ← Empty state when no posts match
    │       │   │   ├── CategoryFilter.js   ← Client-side category chip filter bar
    │       │   │   ├── KeyTakeaways.js     ← Bulleted key points box (AI SEO)
    │       │   │   ├── PostBody.js         ← Portable Text renderer
    │       │   │   ├── QuickAnswer.js      ← Screen-reader-only speakable target
    │       │   │   ├── RelatedPosts.js     ← Related post cards below the post
    │       │   │   ├── TableOfContents.js  ← Sticky sidebar TOC (scroll-aware)
    │       │   │   └── portable/           ← Custom Portable Text block renderers
    │       │   │       ├── PtCallout.js    ← Info/tip/warning/danger callout
    │       │   │       ├── PtCode.js       ← Syntax-highlighted code block
    │       │   │       ├── PtCta.js        ← Call-to-action button block
    │       │   │       ├── PtDivider.js    ← Section divider / horizontal rule
    │       │   │       ├── PtFaq.js        ← Inline FAQ accordion in post body
    │       │   │       ├── PtImage.js      ← Image with alt + caption + LQIP blur
    │       │   │       ├── PtTable.js      ← Responsive table
    │       │   │       └── PtYouTube.js    ← YouTube embed (also emits VideoObject schema)
    │       │   ├── shared/           ← Site-wide components used across all pages
    │       │   │   ├── BrandIcons.js       ← Real SVG logos: X, GitHub, LinkedIn, YouTube…
    │       │   │   ├── Breadcrumbs.js      ← Accessible breadcrumb nav
    │       │   │   ├── DraftModeBanner.js  ← Banner shown when Draft Mode is active
    │       │   │   ├── FAQAccordion.js     ← Accessible accordion (aria-controls, aria-expanded)
    │       │   │   ├── FAQSection.js       ← Section wrapper around FAQAccordion
    │       │   │   ├── Footer.js           ← Footer with nav links + social icons
    │       │   │   ├── JsonLd.js           ← Injects <script type="application/ld+json">
    │       │   │   └── Navbar.js           ← Sticky nav + accessible mobile hamburger menu
    │       │   └── ui/               ← Generic reusable primitives
    │       │       ├── Badge.js            ← Label/tag chip
    │       │       ├── Button.js           ← Styled button (primary/secondary/ghost)
    │       │       ├── Callout.js          ← Callout box with icon
    │       │       ├── Container.js        ← max-w-7xl centred wrapper
    │       │       ├── Divider.js          ← Styled <hr>
    │       │       └── Prose.js            ← Tailwind prose wrapper for rich text
    │       ├── constants/
    │       │   ├── site.js           ← SITE_URL, SITE_NAME (env var fallbacks)
    │       │   └── index.js          ← Re-exports
    │       ├── hooks/
    │       │   └── useTableOfContents.js  ← IntersectionObserver: active heading as user scrolls
    │       ├── i18n/
    │       │   ├── config.js         ← LOCALES, DEFAULT_LOCALE, RTL_LOCALES — edit here to add languages
    │       │   ├── routing.js        ← localizedPath(), replaceLocale()
    │       │   └── utils.js          ← isValidLocale(), isRtlLocale(), getLocaleFromPathname()
    │       ├── sanity/
    │       │   ├── lib/
    │       │   │   ├── config.js     ← Sanity env vars (projectId, dataset, tokens) — single source of truth
    │       │   │   ├── client.js     ← Configured Sanity client; build-safe no-op stub if env missing
    │       │   │   ├── fetch.js      ← sanityFetch() — ISR + Draft Mode aware data fetcher
    │       │   │   └── image.js      ← imageUrl() — CDN URL builder with transform params
    │       │   ├── queries/
    │       │   │   ├── fragments.js  ← Reusable GROQ projection fragments (seoFields, imageFields, etc.)
    │       │   │   ├── posts.js      ← Blog post queries (listing, detail, related, slugs)
    │       │   │   ├── categories.js ← Category queries
    │       │   │   ├── authors.js    ← Author queries
    │       │   │   ├── pages.js      ← Landing page SEO queries
    │       │   │   ├── settings.js   ← Site Settings query
    │       │   │   ├── redirects.js  ← Active redirect rules (used by proxy.js)
    │       │   │   └── index.js      ← Re-exports all queries
    │       │   └── types/
    │       │       └── index.js      ← JSDoc @typedef shapes for all Sanity document types
    │       ├── schema/               ← JSON-LD structured data generators (schema.org)
    │       │   ├── index.js          ← buildPostSchemas() + buildPageSchemas() orchestrators
    │       │   ├── article.js        ← Article / BlogPosting
    │       │   ├── blog.js           ← Blog listing page (Blog + BlogPosting list)
    │       │   ├── breadcrumb.js     ← BreadcrumbList
    │       │   ├── faq.js            ← FAQPage
    │       │   ├── howto.js          ← HowTo (auto-detected from "How to…" post titles)
    │       │   ├── image.js          ← ImageObject
    │       │   ├── localBusiness.js  ← LocalBusiness
    │       │   ├── organization.js   ← Organization (site-wide)
    │       │   ├── person.js         ← Person (author E-E-A-T)
    │       │   ├── product.js        ← Product + AggregateRating
    │       │   ├── review.js         ← Review + Rating
    │       │   ├── service.js        ← Service + ItemList (from Site Settings)
    │       │   ├── speakable.js      ← SpeakableSpecification (voice/AI search)
    │       │   ├── video.js          ← VideoObject (auto-detected from YouTube blocks)
    │       │   ├── webpage.js        ← Generic page entity (WebPage, FAQPage, etc.)
    │       │   └── website.js        ← WebSite + SearchAction (Sitelinks search box)
    │       ├── search/
    │       │   └── index.js          ← Placeholder for Algolia/Pagefind/Fuse.js integration
    │       ├── seo/
    │       │   ├── index.js          ← Re-exports buildMetadata
    │       │   ├── defaults.js       ← Last-resort SEO fallbacks
    │       │   ├── hreflang.js       ← hreflang alternate link tags for all locales
    │       │   ├── metadata.js       ← buildMetadata() — called by every generateMetadata()
    │       │   ├── resolve.js        ← Inheritance resolvers: resolveSeo(), resolveFaq(), etc.
    │       │   └── robots.js         ← buildRobots() — noindex/nofollow to Next.js metadata shape
    │       └── utils/
    │           ├── embed.js          ← getYouTubeId(), getYouTubeThumbnail()
    │           ├── format.js         ← formatDate(), readingTime(), truncate()
    │           ├── portable-text.js  ← toPlainText(), extractHeadings() for Portable Text
    │           ├── resolveHref.js    ← Sanity reference → locale-prefixed URL path
    │           └── index.js          ← Re-exports all utils
    └── studio/                       ← Sanity Studio v5 (TypeScript)
        ├── .env                      ← Gitignored — fill from .env.example
        ├── .env.example              ← Committed template
        ├── env.d.ts                  ← TypeScript declarations for process.env vars
        ├── sanity.config.ts          ← Studio plugins, presentation tool, custom actions
        ├── sanity.cli.ts             ← CLI: projectId, dataset, appId, autoUpdates
        ├── sanity.css                ← Custom Studio styles
        ├── schemaTypes/
        │   ├── index.ts              ← Registers all document + object types
        │   ├── actions/
        │   │   └── publishWithRedirect.ts  ← Auto-creates redirect when a post slug changes
        │   ├── components/           ← Custom Studio sidebar UI panels
        │   │   ├── CharacterCount.tsx    ← Live char counter for meta title/description
        │   │   ├── PreviewPane.tsx       ← Live preview iframe in Studio
        │   │   ├── SchemaPreview.tsx     ← Shows which JSON-LD schemas will be emitted
        │   │   ├── SeoChecklist.tsx      ← Real-time SEO field pass/fail checklist
        │   │   ├── SeoPreview.tsx        ← Google snippet + social card preview
        │   │   └── StudioLayout.tsx      ← Custom Studio layout wrapper
        │   ├── documents/            ← Top-level content types (Studio sidebar items)
        │   │   ├── index.ts
        │   │   ├── author.ts         ← Author: name, role, worksFor, bio, photo, socials
        │   │   ├── blogPost.ts       ← Blog post: full content + SEO + AI SEO
        │   │   ├── category.ts       ← Blog category with default SEO
        │   │   ├── faqItem.ts        ← Standalone FAQ (shared across pages)
        │   │   ├── landingPageSeo.ts ← Landing page SEO: slug → metadata + schema + FAQ
        │   │   ├── redirect.ts       ← URL redirect rule (managed at CMS level)
        │   │   └── siteSettings.ts   ← Singleton: brand, SEO defaults, analytics, services
        │   └── objects/              ← Reusable field groups (embedded in documents)
        │       ├── index.ts
        │       ├── aiSeo.ts              ← Quick Answer, Key Takeaways
        │       ├── analyticsConfig.ts    ← GA4, GTM, Plausible, Clarity IDs
        │       ├── faqList.ts            ← Inline FAQ (used by blogPost body FAQ block)
        │       ├── imageWithMeta.ts      ← Image + alt + caption
        │       ├── link.ts               ← Internal/external link annotation
        │       ├── portableText.ts       ← Rich text field + all custom block types
        │       ├── redirectSettings.ts   ← Auto-redirect settings for posts
        │       ├── schemaConfig.ts       ← Primary schema type picker (per landing page)
        │       ├── searchIndexSettings.ts ← Sitemap / search inclusion toggles
        │       ├── seo.ts                ← metaTitle, metaDescription, ogImage, canonical
        │       └── socialDefaults.ts     ← Default share image + Twitter handle
        └── structure/
            └── index.ts              ← Studio sidebar navigation order and groupings
```

---

## 4. Quick Start

### Prerequisites

- Node.js 20+
- npm 10+ (comes with Node 20)
- A Sanity account — free at [sanity.io](https://www.sanity.io)

### Step 1 — Install dependencies

Always run from the **monorepo root**:

```bash
npm install
```

Never run `npm install` inside `apps/web` or `apps/studio` individually. The workspace hoists everything to `node_modules/` at the root.

### Step 2 — Create a Sanity project

1. Sign in at [sanity.io](https://sanity.io) → Create Project
2. Note your **Project ID** and **Dataset** (default: `production`)

Or use the CLI:

```bash
cd apps/studio
npx sanity init
```

### Step 3 — Set up environment variables

```bash
# Copy templates
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env
```

Fill in `apps/web/.env.local` with at minimum:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Fill in `apps/studio/.env` with:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

> See [Section 5](#5-environment-variables) for all variables.

### Step 4 — Update Studio config

Open `apps/studio/sanity.config.ts` and `apps/studio/sanity.cli.ts`. Replace `YOUR_PROJECT_ID` with your actual project ID.

### Step 5 — Start both apps

```bash
npm run dev
```

- Web app: http://localhost:3000
- Sanity Studio: http://localhost:3333

### Step 6 — Add initial content

Create in this order in Sanity Studio:

1. **Site Settings** → Brand name, site URL, description, logo, social profiles
2. **Landing Pages SEO** → Create a doc with slug `/` for the homepage
3. **Categories** → At least one blog category
4. **Authors** → Name, bio, photo
5. **FAQ Items** → Any FAQ questions you want to reuse
6. **Blog Posts** → Write, assign author + category, publish

---

## 5. Environment Variables

### `apps/web/.env.local`

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | **Yes** | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | **Yes** | Dataset name (usually `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | **Yes** | API date, e.g. `2025-01-01` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Full URL: `https://yourdomain.com`. Used for canonicals and sitemaps |
| `NEXT_PUBLIC_SITE_NAME` | Optional | Fallback brand name if Site Settings is empty |
| `SANITY_API_READ_TOKEN` | For drafts | Viewer token from sanity.io/manage → API → Tokens |
| `SANITY_PREVIEW_SECRET` | For drafts | 32-byte hex string (must match studio env var) |
| `SANITY_REVALIDATE_SECRET` | For webhooks | Any secret string; used in the Sanity webhook header |

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### `apps/studio/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `SANITY_STUDIO_PROJECT_ID` | **Yes** | Same project ID as the web app |
| `SANITY_STUDIO_DATASET` | **Yes** | Same dataset name |
| `SANITY_STUDIO_PREVIEW_URL` | For drafts | `http://localhost:3000` locally; your Vercel URL in production |
| `SANITY_STUDIO_PREVIEW_SECRET` | For drafts | **Must match** `SANITY_PREVIEW_SECRET` in web app |

---

## 6. Architecture

### Landing pages: Code content, CMS metadata

Page *content* (hero, features, sections) lives in React files — version-controlled, reviewed as PRs, never broken by CMS outages.

Page *SEO metadata* (title, description, OG image, JSON-LD schemas, FAQ) lives in the Sanity `landingPageSeo` document — editors update without deploys.

### SEO inheritance chain

```
Site Settings          ← global baseline
        ↓ fallback if unset
    Document           ← per-page override
```

All resolution happens in `src/seo/resolve.js`. The `buildMetadata()` in `src/seo/metadata.js` applies the chain and returns a Next.js metadata object.

### Data flow

```
Sanity CMS (Studio)
        ↓ GROQ query via sanityFetch()
Next.js server component
        ↓ passed as props
React components → rendered HTML
        ↓
<JsonLd> → <script type="application/ld+json">
<head> meta tags (from generateMetadata)
```

### Edge proxy (`src/proxy.js`)

Runs before every request (except `_next/`, `api/`, and static files). Two jobs:

1. **Locale redirect** — `/blog/foo` → `/en/blog/foo`
2. **CMS redirects** — fetches active `redirect` documents from Sanity (1-minute in-memory cache) and applies 301/302 responses before the page renders

---

## 7. Color System (Theming)

Change **only these three CSS variables** in `src/app/globals.css` to retheme the entire app:

```css
@theme {
  --color-primary:   #10b981;  /* buttons, badges, links, highlights */
  --color-secondary: #0f172a;  /* navbar, footer, dark backgrounds  */
  --color-tertiary:  #1e293b;  /* cards and panels on dark surfaces */
}
```

Tailwind v4 automatically generates utility classes: `bg-primary`, `text-secondary`, `border-tertiary`, `hover:bg-primary/90`, etc.

> **Do NOT use** `@tailwind base/components/utilities` — that is Tailwind v3 syntax. Tailwind v4 uses only `@import "tailwindcss"`.

---

## 8. Localization

All routes live under `[locale]` (currently `/en/*`). The proxy redirects bare paths to the default locale. Adding a new language is a one-line change.

### Add a locale

1. Open `src/i18n/config.js`
2. Add to `LOCALES`: `export const LOCALES = ['en', 'fr']`
3. Add display label: `LOCALE_LABELS: { ..., fr: 'Français' }`
4. If right-to-left: add to `RTL_LOCALES`: `['ar']`

The proxy, layout, sitemap, hreflang alternates, and `generateStaticParams` all adapt automatically.

### Translation strategies

| Approach | Best for |
|----------|---------|
| JSON files in `src/i18n/messages/{en,fr}.json` | Static UI strings |
| Locale field on Sanity documents + GROQ `language == $locale` | CMS content with separate documents per language |
| Both combined | UI chrome via JSON; content via Sanity |

---

## 9. SEO System

### What `buildMetadata()` returns

Every page's `generateMetadata()` calls `buildMetadata({ settings, doc, path, locale })`. This returns a complete Next.js metadata object:

- `title` — with optional `%s` template from Site Settings
- `description`
- `openGraph` — title, description, image (1200×630), type, siteName
- `twitter` — card type, title, description, image
- `alternates` — `canonical` URL + `languages` map (hreflang) for every active locale
- `robots` — index/follow or noindex/nofollow

### SEO fields in Sanity Studio

| Field | Limit | Notes |
|-------|-------|-------|
| Meta Title | ≤60 chars | Shown in browser tab and Google results |
| Meta Description | 150–160 chars | Affects click-through rate, not ranking |
| Canonical URL | — | Leave blank — auto-generated from the page path |
| OG Image | 1200×630 px | LinkedIn, Facebook, Slack preview image |
| Quick Answer | 50–80 words | Targets featured snippets, AI Overviews, voice search |
| Key Takeaways | 3–7 bullets | Helps with AI Overviews |
| Primary Schema Type | dropdown | One pick; the rest is auto-detected |

---

## 10. JSON-LD Schema Auto-Detection

Schemas are emitted automatically — editors rarely need to configure anything.

### Blog posts (`buildPostSchemas`)

| Schema | Trigger |
|--------|---------|
| BlogPosting | Always |
| BreadcrumbList | Always |
| Person (author) | Always when post has an author |
| HowTo | Title starts with "How to…" — steps pulled from the first numbered list in the body |
| FAQPage | Post has FAQ items (inline or from faqItem references) |
| SpeakableSpecification | Quick Answer field is filled |
| VideoObject | YouTube block detected in post body |

### Landing pages (`buildPageSchemas`)

| Schema | Trigger |
|--------|---------|
| Primary type | Selected in Sanity schemaConfig (WebPage, FAQPage, AboutPage, etc.) |
| BreadcrumbList | Always |
| FAQPage | Has selectedFaqs — embedded in the primary entity when type is FAQPage |
| SpeakableSpecification | Quick Answer is filled |
| Service + ItemList | Services defined in Site Settings → auto-applied to all landing pages |
| Organization | Site-wide (emitted in root layout) |
| WebSite + SearchAction | Site-wide (emitted in root layout) |

### The Studio SchemaPreview panel

Open any blog post or landing page in Studio → look for the "Schema Output" sidebar panel. It shows exactly which JSON-LD nodes will be emitted — green means active, grey means off.

---

## 11. Analytics

Configure in Sanity Studio → Site Settings → Analytics. No code changes needed.

| Provider | Field |
|---------|-------|
| Google Analytics 4 | `ga4Id` (e.g. `G-XXXXXXXXXX`) |
| Google Tag Manager | `gtmId` (e.g. `GTM-XXXXXXX`) |
| Plausible | `plausibleDomain` (e.g. `yourdomain.com`) |
| Microsoft Clarity | `clarityId` |

Leave a field blank to disable that provider. The `src/analytics/index.js` loader reads these at runtime and injects only the non-empty ones via `<Script strategy="afterInteractive">`.

---

## 12. Draft Preview

Lets editors see unpublished content before publishing.

### Setup

1. Generate a shared secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Add to `apps/web/.env.local`:
   ```env
   SANITY_PREVIEW_SECRET=<your-secret>
   SANITY_API_READ_TOKEN=<viewer-token-from-sanity-manage>
   ```
3. Add to `apps/studio/.env`:
   ```env
   SANITY_STUDIO_PREVIEW_SECRET=<same-secret>
   SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
   ```

### How it works

1. Editor opens a document → clicks the Preview tab
2. Studio calls `/api/draft-mode/enable?secret=...&redirect=/en/blog/my-post`
3. Next.js validates the secret → sets a Draft Mode cookie → redirects
4. `sanityFetch()` detects the cookie → reads unpublished drafts using the read token
5. `DraftModeBanner` appears at the top of the page
6. Editor clicks "Disable preview" → `/api/draft-mode/disable` → clears cookie

---

## 13. On-Demand Revalidation (Webhooks)

When an editor publishes in Sanity, the ISR cache is purged within seconds.

### Setup

1. Go to [sanity.io/manage](https://sanity.io/manage) → API → Webhooks → Create
2. **URL:** `https://yoursite.com/api/revalidate`
3. **Method:** POST
4. **HTTP Headers:** `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`
5. **Filter:**
   ```groq
   *[_type in ["blogPost","category","landingPageSeo","siteSettings","redirect","author","faqItem"]]
   ```
6. Set `SANITY_REVALIDATE_SECRET` in `apps/web/.env.local` and in Vercel

When Sanity fires the webhook, `route.js` validates the signature, calls `revalidateTag('blogPost')` (or whichever type changed), and Next.js purges affected ISR pages instantly.

---

## 14. Routing Map

| URL | File | Mode |
|-----|------|------|
| `/` | proxy redirect → `/en` | — |
| `/en` | `app/[locale]/page.js` | ISR |
| `/en/blog` | `app/[locale]/blog/page.js` | ISR |
| `/en/blog/[slug]` | `app/[locale]/blog/[slug]/page.js` | ISR + SSG |
| `/en/blog/category/[slug]` | `app/[locale]/blog/category/[slug]/page.js` | ISR |
| `/en/faq` | `app/[locale]/faq/page.js` | ISR |
| `/en/author/[slug]` | `app/[locale]/author/[slug]/page.js` | ISR |
| `/robots.txt` | `app/robots.js` | Dynamic |
| `/sitemap.xml` | `app/sitemap.js` | Dynamic |
| `/api/draft-mode/enable` | `app/api/draft-mode/enable/route.js` | Edge |
| `/api/draft-mode/disable` | `app/api/draft-mode/disable/route.js` | Edge |
| `/api/revalidate` | `app/api/revalidate/route.js` | Serverless |

---

## 15. How To: Common Tasks

### Add a landing page

**1. Create the page file:**

```
apps/web/src/app/[locale]/about/page.js
```

**2. Use this template:**

```js
import {sanityFetch} from '@/sanity/lib/fetch'
import {LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {buildMetadata} from '@/seo'
import {resolveFaq, resolveAiSeo} from '@/seo/resolve'
import {buildPageSchemas} from '@/schema'
import FAQSection from '@/components/shared/FAQSection'
import QuickAnswer from '@/components/blog/QuickAnswer'
import JsonLd from '@/components/shared/JsonLd'
import {SITE_URL} from '@/constants/site'
import {localizedPath} from '@/i18n/routing'

async function load() {
  const [settings, pageSeo] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: LANDING_PAGE_SEO_QUERY, params: {slug: 'about'}, tags: ['landingPageSeo']}),
  ])
  return {settings: settings || {}, pageSeo: pageSeo || {}}
}

export async function generateMetadata({params}) {
  const {locale} = await params
  const {settings, pageSeo} = await load()
  return buildMetadata({settings, doc: pageSeo, path: '/about', locale})
}

export default async function AboutPage({params}) {
  const {locale} = await params
  const {settings, pageSeo} = await load()

  const faqs = resolveFaq({doc: pageSeo})
  const aiSeo = resolveAiSeo({doc: pageSeo})
  const url = `${SITE_URL}${localizedPath(locale, '/about')}`
  const schemas = buildPageSchemas({page: pageSeo, url, settings, faqs, breadcrumbs: []})

  return (
    <main>
      {/* Your page content here */}
      <QuickAnswer text={aiSeo.quickAnswer} />
      {faqs.length ? <FAQSection faqs={faqs} /> : null}
      <JsonLd data={schemas} />
    </main>
  )
}
```

**3. Create the Sanity document:**
Studio → Landing Pages SEO → New → title: "About" → slug: `about` → fill SEO → Publish

**4. Add to sitemap:**
In `src/app/sitemap.js`, add `add('/about')` in the core routes section.

**5. Add to Navbar:**
In `src/components/shared/Navbar.js`, add `{href: '/about', label: 'About'}` to `NAV_LINKS`.

---

### Add a locale

```js
// src/i18n/config.js
export const LOCALES = ['en', 'fr']  // add 'fr'
export const LOCALE_LABELS = { en: 'English', fr: 'Français' }
// For RTL:
export const RTL_LOCALES = ['ar']
```

Everything else adapts automatically — proxy, layout, sitemap, hreflang.

---

### Add a new Sanity content type

1. Create `apps/studio/schemaTypes/documents/myType.ts`
2. Import and add it in `apps/studio/schemaTypes/documents/index.ts`
3. Import and add it in `apps/studio/schemaTypes/index.ts`
4. Optionally add to `apps/studio/structure/index.ts` for sidebar order
5. Write a GROQ query in `apps/web/src/sanity/queries/myType.js`
6. Add a `@typedef` in `apps/web/src/sanity/types/index.js`
7. Use `sanityFetch({query: MY_QUERY, tags: ['myType']})` in server components
8. Run `npx sanity schema deploy` from `apps/studio/`

---

### Manage redirects

**CMS redirect (recommended — no deploy needed):**

1. Studio → URL Redirects → New
2. `source`: the old path (e.g. `/old-page`)
3. `destination`: the new path or full URL
4. `permanent`: true for 301, false for 302
5. Toggle `enabled: true` → Publish

**Automatic slug-change redirect:**

When a blog post's slug changes and you publish, the `publishWithRedirect` custom action automatically creates a redirect from the old slug — no manual steps.

---

## 16. Sanity Studio Reference

### Site Settings (singleton)

**Studio → Site Settings**

The global baseline. Fill this in first — all other documents inherit from here.

| Group | Key fields |
|-------|-----------|
| Organization | name, url, description, logo, legalName, contactEmail |
| Default SEO | titleTemplate (`%s — Brand`), metaTitle, metaDescription, ogImage |
| Social Profiles | platform + URL for Twitter/X, LinkedIn, GitHub, YouTube |
| Services | name, description, url — auto-emitted as Service + ItemList schema |
| Analytics | ga4Id, gtmId, plausibleDomain, clarityId |
| Search | searchIndexSettings |

### Blog Post

| Tab | Fields |
|-----|--------|
| Content | title, slug (auto), category, author, excerpt, featuredImage, body (Portable Text) |
| SEO | metaTitle, metaDescription, ogImage, canonicalUrl |
| AI SEO | Quick Answer (50–80 words), Key Takeaways (bullets) |
| Schema | Primary schema type, FAQ items picker |
| Publishing | publishedAt, status, redirectSettings |

### Landing Page SEO

Lightweight SEO config for code-built pages. Create one document per landing page.

| Slug | Route |
|------|-------|
| `/` | Homepage (`/en`) |
| `about` | `/en/about` |
| `services` | `/en/services` |
| `contact` | `/en/contact` |
| `faq` | `/en/faq` |

### FAQ Items

Standalone reusable FAQ items. Create them here, then pick them in any Landing Page SEO or Blog Post document using the "FAQ Items" reference picker.

### Author

| Field | Purpose |
|-------|---------|
| Name | Displayed in bylines and Person schema |
| Role / Title | `jobTitle` in Person schema (E-E-A-T) |
| Organisation / Employer | `worksFor` in Person schema (E-E-A-T) |
| Website | Added to `sameAs` in Person schema |
| Social Profiles | All URLs added to `sameAs` |
| Photo | Used on author page + in schema |
| Bio | Rendered on author profile page |

### URL Redirect

| Field | Purpose |
|-------|---------|
| Source | Old path, e.g. `/old-page` |
| Destination | New path or absolute URL |
| Permanent | true = 308; false = 307 |
| Enabled | Toggle off to pause without deleting |

---

## 17. Deployment

### Web app → Vercel

1. Push repo to GitHub
2. Import at [vercel.com](https://vercel.com/new)
3. **Set Root Directory to `apps/web`** ← critical
4. Add all variables from `apps/web/.env.local` to Vercel (Production + Preview + Development)
5. Deploy

**Common Vercel issues:**

| Symptom | Fix |
|---------|-----|
| `Cannot find module lightningcss-linux-x64-gnu` | Add Linux binaries to `apps/web/package.json` `optionalDependencies` (already included in this template) |
| Sanity queries return empty | Add `NEXT_PUBLIC_SANITY_*` vars in Vercel dashboard |
| Build fails: missing `build:web` | Keep `"build:web": "next build"` alias in `apps/web/package.json` |

### Studio → Sanity Hosting

```bash
# From monorepo root:
npm run deploy:studio

# Or from apps/studio directly:
cd apps/studio && npx sanity deploy
```

After deploying, add your domain to CORS origins:
[sanity.io/manage](https://sanity.io/manage) → API → CORS Origins → Add `https://yourdomain.com`

### Set up the revalidation webhook (production)

After deploying, create the webhook (see [Section 13](#13-on-demand-revalidation-webhooks)) pointing to your live URL.

---

## 18. Command Reference

All commands run from the **monorepo root** unless noted.

| Command | What it does |
|---------|-------------|
| `npm install` | Install all dependencies for both workspaces |
| `npm run dev` | Start web (:3000) and studio (:3333) in parallel |
| `npm run dev:web` | Start Next.js only |
| `npm run dev:studio` | Start Sanity Studio only |
| `npm run build` | Build web then studio |
| `npm run build:web` | Build Next.js (what Vercel calls) |
| `npm run build:studio` | Build Studio |
| `npm run lint -w apps/web` | Lint the web app |
| `npm run lint -w apps/studio` | Lint the studio |
| `npx sanity deploy` | (from `apps/studio`) Deploy Studio to sanity.studio |
| `npx sanity schema deploy` | (from `apps/studio`) Push schema changes to the hosted Studio |
| `npx sanity dataset export production backup.ndjson` | Export a dataset backup |

---

## 19. Known Gotchas

| Symptom | Cause | Fix |
|---------|-------|-----|
| `params.locale` is undefined | Next.js 16 made `params` async | `const { locale } = await params` — always `await` |
| Anchor links don't scroll from another page | `<Link>` doesn't handle hash fragments cross-page | Use plain `<a>` for hash links; build hrefs via `localizedPath(locale, '/#section')` |
| Sanity images 400 error on local dev | NAT64/DNS64 network causes `cdn.sanity.io` to resolve to a private IPv6 range — Next.js SSRF protection blocks it | `images: { unoptimized: true }` in `next.config.mjs` (already set in this template) |
| Images show in HTML but appear broken | Stale dev server | Kill the server (`Ctrl+C`) and restart `npm run dev` |
| Blog / FAQ shows nothing | Content is saved as a draft, not published | Studio → open the document → click Publish |
| `pnpm` warnings about workspaces field | Someone ran `pnpm install` — creates `pnpm-lock.yaml` | Delete `pnpm-lock.yaml` and run `npm install` |
| Studio `Unknown type` schema error | A document references a deleted schema type | Check `link.ts` and object types for references to removed document types |
| Preview not working | Secret mismatch | Confirm `SANITY_PREVIEW_SECRET` equals `SANITY_STUDIO_PREVIEW_SECRET` exactly |
| Vercel build: missing Linux binaries | `package-lock.json` generated on Windows omits Linux native binaries | `optionalDependencies` in `apps/web/package.json` already includes them — run `npm install` and commit the updated lockfile |
| SEO not updating after publish | Revalidation webhook not set up | See [Section 13](#13-on-demand-revalidation-webhooks) |
| Hydration error: `data-new-gr-c-s-check-loaded` | Browser extension (Grammarly, Dark Reader) injecting attributes | Already handled: `suppressHydrationWarning` on `<body>` in `layout.js` |
| `Cannot run "select" prompt` on `sanity deploy` | Running in a non-interactive terminal | Add `--url <hostname>` flag: `npx sanity deploy --url yourstudio -y` |
