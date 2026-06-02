# Next.js + Sanity Publishing Platform — Developer Guide

A reusable, CMS-first publishing platform built on **Next.js 16** (App Router, JavaScript) and **Sanity Studio v5** (TypeScript). This document is the single source of truth for understanding, running, extending, and deploying this monorepo.

> **Data flow:** Sanity CMS → Next.js → Rendered Website

---

## Table of Contents

1. [What This Is](#1-what-this-is)
2. [Tech Stack](#2-tech-stack)
3. [Full Directory Structure](#3-full-directory-structure)
4. [File & Folder Reference](#4-file--folder-reference)
   - [Root Level](#root-level)
   - [apps/web — Next.js Frontend](#appsweb--nextjs-frontend)
   - [apps/studio — Sanity CMS](#appsstudio--sanity-cms)http://localhost:3000/en/blog?category=web-development
5. [Architecture & Design Decisions](#5-architecture--design-decisions)
6. [Color System](#6-color-system)
7. [Localization Architecture](#7-localization-architecture)
8. [SEO System](#8-seo-system)
9. [JSON-LD Schema Generation](#9-json-ld-schema-generation)
10. [Analytics](#10-analytics)
11. [Draft Preview](#11-draft-preview)
12. [On-Demand Revalidation](#12-on-demand-revalidation)
13. [Routing Map](#13-routing-map)
14. [Environment Variables](#14-environment-variables)
15. [Quick Start](#15-quick-start)
16. [How To: Common Tasks](#16-how-to-common-tasks)
    - [Add a Landing Page](#add-a-landing-page)
    - [Add a Locale](#add-a-locale)
    - [Add a New Sanity Content Type](#add-a-new-sanity-content-type)
    - [Add a New Blog Category](#add-a-new-blog-category)
    - [Manage Redirects](#manage-redirects)
17. [SEO Fields Explained](#17-seo-fields-explained)
18. [Sanity Studio: Content Types Reference](#18-sanity-studio-content-types-reference)
19. [Deployment](#19-deployment)
20. [Command Reference](#20-command-reference)
21. [Known Gotchas](#21-known-gotchas)

---

## 1. What This Is

This is a two-app npm-workspace monorepo:

- **`apps/web`** — Next.js 16 frontend. Landing page (hero, sections, testimonials, FAQ) + full blog system (listing, post detail, category archive, author pages). All SEO, schema, analytics, and redirects are CMS-controlled.
- **`apps/studio`** — Sanity Studio v5 CMS. Editors manage all content, SEO metadata, JSON-LD schema config, analytics credentials, and URL redirects from here — no code changes needed.

**Core principle:** Code renders; Sanity controls what gets rendered and how it appears to search engines and AI. Landing page *content* lives in code (easy to version control, review, deploy); landing page *SEO metadata* lives in Sanity (editors can update meta titles, descriptions, OG images, schemas without a deploy).

### Features at a glance

| Feature | Description |
|---|---|
| Blog system | Posts, categories, authors with full Sanity content management |
| Landing page SEO | Manage meta, OG, JSON-LD for code-built pages from Sanity |
| JSON-LD schema | Article, FAQPage, BreadcrumbList, Person, Organization, WebSite, HowTo, Product, Review, Video — configurable per-document |
| SEO inheritance | Site Settings → Category → Document; set once at the highest level, override where needed |
| AI SEO | Quick Answer, Key Takeaways, Speakable schema for Google AI Overviews and voice search |
| Draft preview | Sanity Presentation tool + Next.js draft cookies |
| On-demand revalidation | Sanity webhook → `/api/revalidate` → ISR cache purged in seconds |
| Multi-language routing | `[locale]` URL segment; add a locale in one line |
| Redirect management | Editor-managed 301/302 redirects via Sanity `redirect` documents |
| Analytics | CMS-driven GA4, GTM, Plausible, Clarity — configure IDs in Sanity, zero code changes |
| Portable Text | Rich blog content with images, tables, callouts, YouTube embeds, CTAs, FAQs, code blocks |

---

## 2. Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | App Router, server components by default |
| UI | React / React DOM | 19.2.4 | |
| Language (web) | JavaScript | — | JSDoc `@typedef` for type checking; no TypeScript toolchain needed |
| Language (studio) | TypeScript | ^5.8 | Sanity requires it |
| Styling | Tailwind CSS | v4 | `@import "tailwindcss"` + `@theme` block; no `tailwind.config.js` |
| CMS client | next-sanity | ^13.0.3 | Wraps `@sanity/client` with Next.js ISR support |
| CMS | Sanity Studio | v5.26.0 | Hosted on Sanity servers, separate from Next.js |
| Icons | lucide-react | — | Used in blog components |
| Dev runner | concurrently | ^9 | Runs both apps in parallel |
| Package manager | npm only | — | npm workspaces; never use yarn/pnpm/bun |
| Deployment | Vercel (web) | — | Root Directory: `apps/web` |
| Deployment | Sanity Hosting (studio) | — | `npx sanity deploy` |

---

## 3. Full Directory Structure

```
monorepo/
├── .gitignore                        ← Single root gitignore covering both apps
├── README.md                         ← This file — full developer guide
├── package.json                      ← Root: workspaces, shared dev scripts
├── package-lock.json                 ← Generated; do not edit manually
├── node_modules/                     ← Hoisted shared packages (generated)
└── apps/
    ├── web/                          ← Next.js 16 frontend (JavaScript)
    │   ├── .env.example              ← Template; safe to commit
    │   ├── .env.local                ← Real secrets; gitignored, NEVER commit
    │   ├── AGENTS.md                 ← AI agent instructions for this app
    │   ├── CLAUDE.md                 ← Claude Code instructions
    │   ├── eslint.config.mjs         ← ESLint flat config (next/core-web-vitals)
    │   ├── jsconfig.json             ← Path alias: @/* → ./src/*
    │   ├── next.config.mjs           ← Image remotePatterns (cdn.sanity.io)
    │   ├── package.json              ← App dependencies and build scripts
    │   ├── postcss.config.mjs        ← @tailwindcss/postcss plugin
    │   └── src/
    │       ├── proxy.js              ← Next.js 16 edge proxy (locale redirect + CMS redirects)
    │       ├── analytics/
    │       │   └── index.js          ← CMS-driven analytics loader (GA4, GTM, Plausible, Clarity)
    │       ├── app/
    │       │   ├── globals.css       ← Tailwind import + 3-variable brand color system
    │       │   ├── robots.js         ← Dynamic robots.txt generation
    │       │   ├── sitemap.js        ← Dynamic XML sitemap (posts, categories, authors, core routes)
    │       │   └── [locale]/         ← Every route lives under this segment
    │       │       ├── layout.js     ← Root layout: <html>, <body>, Navbar, Footer, JSON-LD, analytics
    │       │       ├── page.js       ← Homepage (hardcoded content, SEO from Sanity)
    │       │       ├── blog/
    │       │       │   ├── page.js             ← Blog listing with category filter chips
    │       │       │   ├── [slug]/page.js       ← Blog post detail
    │       │       │   └── category/[slug]/page.js ← Category archive
    │       │       └── author/
    │       │           └── [slug]/page.js       ← Author profile page
    │       ├── components/
    │       │   ├── blog/             ← Blog-specific components
    │       │   │   ├── AuthorCard.js       ← Author bio box on post pages
    │       │   │   ├── BlogCard.js         ← Post card for listing/related posts
    │       │   │   ├── BlogEmptyState.js   ← Empty state when no posts found
    │       │   │   ├── CategoryFilter.js   ← Horizontal filter chip bar for blog listing
    │       │   │   ├── KeyTakeaways.js     ← Bulleted key takeaways box (AI SEO)
    │       │   │   ├── PostBody.js         ← Renders Portable Text body
    │       │   │   ├── QuickAnswer.js      ← Featured snippet summary box (AI SEO)
    │       │   │   ├── RelatedPosts.js     ← Related post cards at bottom of post
    │       │   │   ├── TableOfContents.js  ← Auto-generated TOC from post headings
    │       │   │   └── portable/           ← Custom Portable Text block renderers
    │       │   │       ├── PtCallout.js    ← Tip/warning/info callout blocks
    │       │   │       ├── PtCode.js       ← Syntax-highlighted code blocks
    │       │   │       ├── PtCta.js        ← Call-to-action button blocks
    │       │   │       ├── PtDivider.js    ← Horizontal rule / section divider
    │       │   │       ├── PtFaq.js        ← Inline FAQ accordion block
    │       │   │       ├── PtImage.js      ← Image block with alt text + caption
    │       │   │       ├── PtTable.js      ← Responsive table block
    │       │   │       └── PtYouTube.js    ← YouTube embed block
    │       │   ├── shared/           ← Site-wide shared components
    │       │   │   ├── Breadcrumbs.js      ← Breadcrumb nav + BreadcrumbList schema
    │       │   │   ├── DraftModeBanner.js  ← Shown when draft preview is active
    │       │   │   ├── FaqAccordion.js     ← Client-side accordion (one-open-at-a-time)
    │       │   │   ├── FAQSection.js       ← Server wrapper: renders FaqAccordion with data
    │       │   │   ├── Footer.js           ← Site footer (4 link columns + social icons)
    │       │   │   ├── JsonLd.js           ← Injects <script type="application/ld+json"> tags
    │       │   │   └── Navbar.js           ← Sticky navbar with mobile hamburger menu
    │       │   └── ui/               ← Generic reusable UI primitives
    │       │       ├── Badge.js            ← Small label/tag chip
    │       │       ├── Button.js           ← Styled button (primary/secondary/ghost variants)
    │       │       ├── Callout.js          ← Callout box (tip, warning, info, danger)
    │       │       ├── Container.js        ← Max-width content wrapper with padding
    │       │       ├── Divider.js          ← Visual separator line
    │       │       └── Prose.js            ← Tailwind prose wrapper for rich text
    │       ├── constants/
    │       │   ├── index.js          ← Re-exports all constants
    │       │   └── site.js           ← SITE_URL, SITE_NAME fallback values
    │       ├── hooks/
    │       │   └── useTableOfContents.js  ← Tracks active heading as user scrolls
    │       ├── i18n/
    │       │   ├── config.js         ← LOCALES, DEFAULT_LOCALE, RTL_LOCALES (single source of truth)
    │       │   ├── routing.js        ← localizedPath(), replaceLocale() path builders
    │       │   └── utils.js          ← isValidLocale(), getLocaleFromPathname(), resolveLocale()
    │       ├── sanity/
    │       │   ├── lib/
    │       │   │   ├── api.js        ← Sanity API helpers (dataset, project config)
    │       │   │   ├── client.js     ← createClient (build-safe: no-op stub if env missing)
    │       │   │   ├── fetch.js      ← sanityFetch() — ISR + draft mode aware
    │       │   │   └── image.js      ← urlFor() image URL builder (Sanity image pipeline)
    │       │   ├── queries/
    │       │   │   ├── categories.js ← GROQ queries for category listing and single category
    │       │   │   ├── faqs.js       ← GROQ queries for FAQ items
    │       │   │   ├── fragments.js  ← Reusable GROQ fragment strings (seoFields, aiSeoFields, etc.)
    │       │   │   ├── index.js      ← Re-exports all queries
    │       │   │   ├── pages.js      ← LANDING_PAGE_SEO_QUERY, ALL_LANDING_PAGES_QUERY
    │       │   │   ├── posts.js      ← GROQ queries for blog posts (listing, detail, related)
    │       │   │   ├── redirects.js  ← GROQ query to fetch active redirects for proxy
    │       │   │   └── settings.js   ← SITE_SETTINGS_QUERY
    │       │   └── types/
    │       │       └── index.js      ← JSDoc @typedef shapes for all Sanity document types
    │       ├── schema/               ← JSON-LD structured data generators
    │       │   ├── index.js          ← buildPostSchemas(), buildPageSchemas() orchestrators
    │       │   ├── article.js        ← Article / BlogPosting schema
    │       │   ├── blog.js           ← Blog schema
    │       │   ├── breadcrumb.js     ← BreadcrumbList schema
    │       │   ├── faq.js            ← FAQPage schema
    │       │   ├── howto.js          ← HowTo schema
    │       │   ├── image.js          ← ImageObject schema
    │       │   ├── localBusiness.js  ← LocalBusiness schema
    │       │   ├── organization.js   ← Organization schema
    │       │   ├── person.js         ← Person schema (author E-E-A-T)
    │       │   ├── product.js        ← Product schema
    │       │   ├── review.js         ← Review schema
    │       │   ├── speakable.js      ← SpeakableSpecification schema (voice search)
    │       │   ├── video.js          ← VideoObject schema
    │       │   └── website.js        ← WebSite schema (with SearchAction)
    │       ├── search/
    │       │   └── index.js          ← Placeholder for future search integration
    │       ├── seo/
    │       │   ├── index.js          ← Re-exports buildMetadata
    │       │   ├── defaults.js       ← Default/fallback SEO values
    │       │   ├── hreflang.js       ← Generates hreflang alternate link tags
    │       │   ├── metadata.js       ← buildMetadata() — used by every generateMetadata()
    │       │   ├── resolve.js        ← SEO inheritance resolvers (resolveMetaTitle, resolveSeoImage, etc.)
    │       │   └── robots.js         ← Robots directive helpers
    │       └── utils/
    │           ├── index.js          ← Re-exports all utils
    │           ├── embed.js          ← YouTube/video URL parsing utilities
    │           ├── format.js         ← Date formatting, text truncation, reading time
    │           ├── portable-text.js  ← Portable Text component map for @portabletext/react
    │           └── resolveHref.js    ← Resolve internal Sanity link references to URL paths
    └── studio/                       ← Sanity Studio v5 (TypeScript)
        ├── .env                      ← Filled-in studio env vars (gitignored)
        ├── .env.example              ← Template; safe to commit
        ├── env.d.ts                  ← TypeScript declarations for env vars
        ├── eslint.config.mjs         ← ESLint: @sanity/eslint-config-studio
        ├── package.json              ← Studio dependencies
        ├── sanity.cli.ts             ← CLI config: projectId, dataset, autoUpdates
        ├── sanity.config.ts          ← Studio config: plugins, presentation tool, document actions
        ├── sanity.css                ← Custom Studio styles
        ├── tsconfig.json             ← TypeScript config for the studio
        ├── schemaTypes/
        │   ├── index.ts              ← Imports and registers all document + object types
        │   ├── actions/
        │   │   └── publishWithRedirect.ts  ← Custom publish action: saves old slug before publish
        │   ├── components/           ← Custom Studio UI components
        │   │   ├── CharacterCount.tsx    ← Live character counter for meta title/description
        │   │   ├── PreviewPane.tsx       ← Live preview iframe embedded in Studio
        │   │   ├── SchemaPreview.tsx     ← Shows JSON-LD preview for the current document
        │   │   ├── SeoChecklist.tsx      ← Real-time SEO field checklist in Studio sidebar
        │   │   ├── SeoPreview.tsx        ← Google/Twitter snippet preview
        │   │   └── StudioLayout.tsx      ← Custom Studio layout wrapper
        │   ├── documents/            ← Top-level Sanity document types (appear in sidebar)
        │   │   ├── index.ts              ← Registers all document types
        │   │   ├── author.ts             ← Author: name, slug, bio, photo, socials, expertise
        │   │   ├── blogPost.ts           ← Blog post: title, slug, category, body, SEO, AI SEO, schema
        │   │   ├── category.ts           ← Category: name, slug, description, default SEO
        │   │   ├── faqItem.ts            ← Standalone FAQ item: question, answer, order
        │   │   ├── landingPageSeo.ts     ← Landing page SEO doc: slug → SEO + schema + FAQ
        │   │   ├── redirect.ts           ← URL redirect: fromSlug, toUrl, type (301/302)
        │   │   └── siteSettings.ts       ← Singleton: brand name, URL, default SEO, analytics IDs
        │   └── objects/              ← Reusable field groups embedded in documents
        │       ├── index.ts              ← Registers all objects
        │       ├── aiSeo.ts              ← AI SEO fields: quick answer, speakable, key takeaways
        │       ├── analyticsConfig.ts    ← Analytics IDs: GA4, GTM, Plausible, Clarity
        │       ├── faqList.ts            ← Inline FAQ list (array of question+answer pairs)
        │       ├── imageWithMeta.ts      ← Image with alt text and caption fields
        │       ├── link.ts               ← Internal/external link (references blogPost, category, author)
        │       ├── portableText.ts       ← Rich text field with all custom block types
        │       ├── redirectSettings.ts   ← Redirect-on-publish settings for blog posts
        │       ├── schemaConfig.ts       ← JSON-LD schema type selection per document
        │       ├── searchIndexSettings.ts ← Search indexing control fields
        │       ├── seo.ts                ← Core SEO fields: metaTitle, metaDescription, ogImage, etc.
        │       └── socialDefaults.ts     ← Default social sharing image + text
        └── structure/
            └── index.ts              ← Sanity Studio sidebar navigation structure
```

---

## 4. File & Folder Reference

### Root Level

| File / Folder | Purpose |
|---|---|
| `package.json` | Declares npm workspaces (`apps/web`, `apps/studio`), `dev`, `dev:web`, `dev:studio`, `build`, `build:web` scripts, and `concurrently` as a dev dependency |
| `.gitignore` | Single root-level ignore file covering both apps — `node_modules`, `.next/`, `dist/`, `.sanity/`, `.env*.local`, editor folders, OS files, Vercel artifacts |
| `README.md` | This file |
| `package-lock.json` | Auto-generated by npm; do not edit manually |
| `node_modules/` | Hoisted workspace dependencies; generated by `npm install` |
| `apps/` | Contains both `web` and `studio` sub-apps |

### apps/web — Next.js Frontend

#### Config files

| File | Purpose |
|---|---|
| `package.json` | Dependencies: `next@16.2.6`, `next-sanity@^13`, `react@19.2.4`. Dev: Tailwind, ESLint. Includes `build:web` alias for Vercel |
| `next.config.mjs` | Allows `cdn.sanity.io` in `<Image>` `remotePatterns`. Required for all Sanity images to load |
| `postcss.config.mjs` | Enables `@tailwindcss/postcss` plugin — Tailwind v4 requirement |
| `jsconfig.json` | Path alias `@/*` → `./src/*`. Makes all imports like `@/components/Foo` work |
| `eslint.config.mjs` | ESLint flat config extending `next/core-web-vitals` |
| `.env.example` | Committed template showing all required env var names with placeholder values |
| `.env.local` | Real secrets — gitignored, never committed |

#### src/proxy.js

The Next.js 16 edge proxy (formerly `middleware.js`). Runs on every request that isn't a Next.js internal or API route. Two responsibilities:

1. **Locale redirect** — If the URL doesn't start with a known locale prefix (e.g., `/en/`), redirect to `/<DEFAULT_LOCALE><path>`. So `/blog/foo` → `/en/blog/foo`.
2. **CMS redirects** — Fetches active `redirect` documents from Sanity and applies them as 301/302 responses before the page renders.

The exported function is named `proxy` (not `middleware`) — this is the Next.js 16 convention. The `matcher` config excludes `api/`, `_next/static`, `_next/image`, `favicon.ico`, and files with extensions.

#### src/app/globals.css

Tailwind v4 entry point. Contains:
- `@import "tailwindcss"` — the single import (replaces v3's `@tailwind base/components/utilities`)
- `@theme { ... }` — defines three brand color variables that become Tailwind utility classes everywhere

#### src/app/robots.js

Generates `robots.txt` dynamically at `GET /robots.txt`. Reads `SITE_URL` from env to construct the sitemap URL.

#### src/app/sitemap.js

Generates `sitemap.xml` dynamically. Includes blog posts, categories, authors, and the homepage. To add a new landing page route, call `add('/your-slug')` in the core routes section.

#### src/app/[locale]/layout.js

The root layout — owns `<html>` and `<body>` (there is no `app/layout.js`). Every route is nested under `[locale]` so this layout wraps everything. Responsibilities:
- Reads `locale` from `params` (async in Next.js 15+)
- Sets `<html lang>` and `dir` (ltr/rtl)
- Passes `locale` to Navbar and Footer
- Renders analytics scripts (from `analytics/index.js`)
- Renders site-wide JSON-LD (Organization, WebSite schemas from Site Settings)
- Calls `notFound()` if the locale param is invalid (defensive against bypassed proxy)
- `generateStaticParams` returns all active locales for build-time prerendering

#### src/app/[locale]/page.js (Homepage)

Async server component. Fetches `LANDING_PAGE_SEO_QUERY` with slug `/` from Sanity for metadata and JSON-LD. The page *content* is hardcoded React components. Pattern to follow for all landing pages.

#### src/app/[locale]/blog/page.js

Blog listing page. Fetches all published posts ordered by `publishedAt desc`. Renders `CategoryFilter` chip bar at the top, then a grid of `BlogCard` components. Uses `force-dynamic` so the build doesn't require Sanity to be reachable.

#### src/app/[locale]/blog/[slug]/page.js

Blog post detail page. Fetches a single post by slug. Renders `PostBody` (Portable Text), `TableOfContents`, `QuickAnswer`, `KeyTakeaways`, `AuthorCard`, `RelatedPosts`, `FAQSection`, `Breadcrumbs`, and JSON-LD schemas. `generateStaticParams` pre-renders all published slugs at build time (try/catch returns `[]` if Sanity unreachable).

#### src/app/[locale]/blog/category/[slug]/page.js

Category archive page. Fetches all posts in a given category. Renders category description and a grid of `BlogCard` components.

#### src/app/[locale]/author/[slug]/page.js

Author profile page. Fetches author details (bio, photo, socials, expertise) and their published posts. Renders `AuthorCard` and post grid.

#### src/app/api/draft-mode/enable/route.js

`GET` handler. Validates `?secret=` query param against `SANITY_PREVIEW_SECRET`. On success, enables Next.js Draft Mode (sets a cookie) and redirects to the requested path. Called by Sanity Presentation tool.

#### src/app/api/draft-mode/disable/route.js

`GET` handler. Disables Draft Mode (clears the cookie) and redirects to `/`.

#### src/app/api/revalidate/route.js

`POST` handler. Called by Sanity webhook on content publish. Validates `SANITY_REVALIDATE_SECRET` from `Authorization` header. Calls `revalidateTag()` for the document type that changed (e.g., `blogPost`, `landingPageSeo`, `siteSettings`). This purges the ISR cache for affected pages within seconds.

#### src/analytics/index.js

CMS-driven analytics loader. Reads GA4, GTM, Plausible, and Clarity IDs from the Sanity `siteSettings` document and injects the appropriate `<script>` tags. Zero code changes needed to switch or add analytics providers — just update the IDs in Studio.

#### src/constants/site.js

Exports `SITE_URL` (from `NEXT_PUBLIC_SITE_URL` env var or a fallback) and `SITE_NAME`. Used by SEO and schema generators as fallback values before Sanity data loads.

#### src/hooks/useTableOfContents.js

Client-side hook. Subscribes to an `IntersectionObserver` on all `h2`/`h3` elements in the post body. Returns the `id` of the currently-visible heading so `TableOfContents.js` can highlight the active entry as the user scrolls.

#### src/i18n/config.js

**Single source of truth for localization.** Exports:
- `LOCALES` — array of active locale codes. Currently `['en']`. Add a new code here to enable a new locale.
- `DEFAULT_LOCALE` — `'en'`
- `LOCALE_LABELS` — display names for locale switcher UIs
- `RTL_LOCALES` — locales that render right-to-left (drives `<html dir>`)

Everything else — the proxy, layout, link helpers, `generateStaticParams` — reads from this file and adapts automatically.

#### src/i18n/routing.js

Path builder helpers:
- `localizedPath(locale, path)` — builds a locale-prefixed href. `localizedPath('en', '/blog')` → `/en/blog`. Every internal link in the app uses this so URLs are always canonical.
- `replaceLocale(pathname, nextLocale)` — swaps the locale segment. Used by locale switcher UIs once additional locales are enabled.

#### src/i18n/utils.js

Pure helpers safe to call from Edge, server, and client:
- `isValidLocale(value)` — type guard
- `getLocaleFromPathname('/en/blog/foo')` → `'en'`
- `isRtlLocale(locale)` — checks RTL list
- `resolveLocale(value)` — coerces unknown → valid locale with fallback

#### src/sanity/lib/client.js

Creates and exports the Sanity client. **Build-safe**: if `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing, exports a no-op stub (`{ fetch: async () => [] }`) so Vercel builds pass even before env vars are configured.

#### src/sanity/lib/fetch.js

`sanityFetch({ query, params, tags })` — the primary way to query Sanity from server components. Automatically switches between:
- **Published content** (ISR with `revalidate` tags) in production
- **Draft content** (bypasses CDN, uses read token) when Next.js Draft Mode is active

Use this instead of `client.fetch()` directly for all page-level data fetching.

#### src/sanity/lib/image.js

Exports `urlFor(source)` — a Sanity image URL builder that applies transformations (crop, hotspot, format, width). Used wherever Sanity images are rendered.

#### src/sanity/lib/api.js

Exports the Sanity project/dataset config values read from env vars. Used internally by the client and fetch utilities.

#### src/sanity/queries/

All GROQ query strings are centralized here. Never write a GROQ query inline in a page component.

| File | Exports |
|---|---|
| `fragments.js` | Reusable GROQ fragments: `seoFields`, `aiSeoFields`, `schemaConfigFields`, `authorFields`, `imageFields`. Compose these into full queries. |
| `posts.js` | `POSTS_QUERY` (listing), `POST_BY_SLUG_QUERY` (detail), `POST_SLUGS_QUERY` (static params), `RELATED_POSTS_QUERY` |
| `categories.js` | `CATEGORIES_QUERY` (all), `CATEGORY_BY_SLUG_QUERY` (detail with posts) |
| `pages.js` | `LANDING_PAGE_SEO_QUERY` (single, by slug), `ALL_LANDING_PAGES_QUERY` (for sitemap) |
| `settings.js` | `SITE_SETTINGS_QUERY` |
| `faqs.js` | `FAQS_QUERY` |
| `redirects.js` | `REDIRECTS_QUERY` — used by proxy to fetch active CMS redirects |
| `index.js` | Re-exports everything for clean imports: `import { POST_BY_SLUG_QUERY } from '@/sanity/queries'` |

#### src/sanity/types/index.js

JSDoc `@typedef` definitions for all Sanity document shapes. Provides editor IntelliSense without a TypeScript toolchain. Types include `SiteSettings`, `BlogPost`, `Category`, `Author`, `LandingPageSeo`, `Redirect`, `FaqItem`.

#### src/schema/ (JSON-LD generators)

Each file exports a function that takes data and returns a valid JSON-LD object. The `index.js` file exports two orchestrators:

- `buildPostSchemas({ post, url, settings, breadcrumbs })` — for blog post pages. Composes: Article/BlogPosting, Person (author), BreadcrumbList, FAQPage (if post has FAQs), SpeakableSpecification.
- `buildPageSchemas({ page, url, schemaConfig, faqs, breadcrumbs })` — for landing pages. Composes schemas based on the `schemaConfig.primarySchemaType` selected in Studio (Organization, WebSite, LocalBusiness, HowTo, Product, Review, etc.).

The output is passed to `<JsonLd data={schemas} />` which injects `<script type="application/ld+json">` tags.

#### src/seo/

| File | Purpose |
|---|---|
| `metadata.js` | `buildMetadata({ settings, doc, path, locale })` — called by every page's `generateMetadata()`. Returns a Next.js metadata object with title, description, openGraph, twitter, alternates (canonical + hreflang), and robots directives. |
| `resolve.js` | `resolveMetaTitle()`, `resolveMetaDescription()`, `resolveSeoImage()`, `resolveCanonical()`, `resolveRobots()`, `resolveFaq()`, `resolveSchemaConfig()` — implements the three-level SEO inheritance chain: Site Settings → Category → Document |
| `hreflang.js` | Generates `<link rel="alternate" hreflang="...">` tags for all active locales |
| `defaults.js` | Fallback values used when neither the document nor Site Settings have a value |
| `robots.js` | Helpers for parsing and composing robots directive strings |
| `index.js` | Re-exports `buildMetadata` |

#### src/utils/

| File | Purpose |
|---|---|
| `format.js` | `formatDate(iso)`, `truncate(str, maxLen)`, `readingTime(text)` |
| `embed.js` | `getYouTubeId(url)`, `getYouTubeThumbnail(url)` |
| `portable-text.js` | The `components` map for `@portabletext/react`. Maps each custom block type (`callout`, `code`, `cta`, `youtube`, `table`, `faqBlock`, `divider`) to its `Pt*` component. |
| `resolveHref.js` | `resolveHref(doc)` — converts a Sanity reference object (with `_type` and `slug`) to a URL path. Used for internal links in Portable Text. |
| `index.js` | Re-exports all utils |

#### src/components/blog/

| Component | Purpose |
|---|---|
| `AuthorCard.js` | Author bio box: photo (or initial), name, title, bio, social links. Shown at the bottom of blog posts. |
| `BlogCard.js` | Post preview card: cover image, category badge, title, excerpt, date, read time, "Read more" link. Used on listing and related posts. |
| `BlogEmptyState.js` | Message shown when a category has no posts or search returns nothing. |
| `CategoryFilter.js` | Horizontal scrollable chip bar of categories on the blog listing page. Clicking a chip filters posts client-side. |
| `KeyTakeaways.js` | Styled box with a bulleted list of key points. Populated from `aiSeo.keyTakeaways` in Sanity. Helps with AI Overviews / featured snippets. |
| `PostBody.js` | Main post content renderer. Uses `@portabletext/react` with the custom component map from `utils/portable-text.js`. |
| `QuickAnswer.js` | Highlighted summary box at the top of a post. Populated from `aiSeo.quickAnswer`. Targets featured snippet and voice search. |
| `RelatedPosts.js` | Horizontal row of related `BlogCard` components shown below the post. |
| `TableOfContents.js` | Sidebar TOC generated from post headings. Uses `useTableOfContents` hook to highlight the active section as user scrolls. |

#### src/components/shared/

| Component | Purpose |
|---|---|
| `Navbar.js` | Sticky top nav. All internal hrefs go through `localizedPath()`. Uses plain `<a>` for hash links so browser handles cross-page anchor scrolling natively. Mobile hamburger menu. |
| `Footer.js` | 4-column link grid + brand + social icons (X, LinkedIn, GitHub, YouTube). All real internal hrefs use `localizedPath()`. |
| `Breadcrumbs.js` | Accessible breadcrumb navigation. Also generates `BreadcrumbList` JSON-LD inline. |
| `DraftModeBanner.js` | Sticky banner shown at the top of every page when Next.js Draft Mode is active. Includes a "Disable preview" link. |
| `FAQSection.js` | Server component wrapper that renders `FaqAccordion` with FAQ data. |
| `FaqAccordion.js` | `'use client'` accordion. One item open at a time. Receives `faqs` array from parent. |
| `JsonLd.js` | Renders an array of JSON-LD objects as `<script type="application/ld+json">` tags in the page `<head>`. |

#### src/components/ui/

Generic primitives with no business logic. Use these as building blocks for new components.

| Component | Props |
|---|---|
| `Badge.js` | `children`, `variant` (default/primary/secondary) |
| `Button.js` | `children`, `variant` (primary/secondary/ghost), `href` (renders as `<a>` or `<button>`) |
| `Callout.js` | `type` (tip/warning/info/danger), `children` |
| `Container.js` | `children`, `className` — wraps content in `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| `Divider.js` | No props; renders a styled `<hr>` |
| `Prose.js` | `children` — wraps Tailwind `prose` class for rich text |

---

### apps/studio — Sanity CMS

#### Root config files

| File | Purpose |
|---|---|
| `sanity.config.ts` | Main Studio config. Declares `projectId`, `dataset`, registers plugins (`structureTool` with custom structure, `presentationTool` for live preview, `visionTool` for GROQ explorer), registers document actions (`publishWithRedirect`), sets `REDIRECT_AWARE_TYPES` |
| `sanity.cli.ts` | CLI config: `projectId`, `dataset`, `autoUpdates: true` |
| `tsconfig.json` | TypeScript config: `strict: true`, `moduleResolution: Bundler`, `jsx: preserve` |
| `eslint.config.mjs` | Extends `@sanity/eslint-config-studio` |
| `sanity.css` | Custom Studio CSS overrides (scoped to Studio UI elements) |
| `env.d.ts` | TypeScript `declare` statements for `process.env.*` env var names used in Studio |
| `.env` / `.env.example` | Studio-specific env vars: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_PREVIEW_URL`, `SANITY_STUDIO_PREVIEW_SECRET` |

#### schemaTypes/index.ts

Imports and registers all document types and object types into the `schemaTypes` array consumed by `sanity.config.ts`. **When adding a new schema type, import it here.**

#### schemaTypes/actions/publishWithRedirect.ts

A custom Sanity document action that wraps the default publish action. Before publishing a `blogPost`, it checks whether the slug has changed. If it has, it automatically creates a `redirect` document pointing from the old slug to the new slug — preventing broken links. Configured in `sanity.config.ts` under `document.actions`.

#### schemaTypes/components/

Custom Studio UI components used inside document editing forms:

| Component | Purpose |
|---|---|
| `CharacterCount.tsx` | Inline component showing remaining character count for a text field. Used on `seo.metaTitle` (warns at 60, errors at 70) and `seo.metaDescription` (warns at 160, errors at 180). |
| `PreviewPane.tsx` | Embeds a live preview iframe in the Studio document panel. Reads the document's slug and type to construct the correct preview URL. Calls `/api/draft-mode/enable?secret=...&redirect=/path`. |
| `SchemaPreview.tsx` | Renders a syntax-highlighted JSON preview of the JSON-LD output for the current document, so editors can see exactly what schema Google will receive. |
| `SeoChecklist.tsx` | Real-time checklist in the document sidebar. Checks: meta title length, description length, OG image present, canonical set, etc. |
| `SeoPreview.tsx` | Renders a mock Google search result snippet and a mock Twitter card using the current document's SEO fields. |
| `StudioLayout.tsx` | Custom layout wrapper used by the Studio to inject global UI elements (e.g., the custom brand header bar). |

#### schemaTypes/documents/

Each file defines one Sanity document type (a top-level content item that appears in the Studio sidebar).

| Document | Fields | Purpose |
|---|---|---|
| `siteSettings.ts` | brandName, siteUrl, description, logo, favicon, defaultSeo, defaultOgImage, socialProfiles, analyticsConfig, searchIndexSettings, redirectSettings | Singleton. Global defaults for SEO, branding, analytics. All other documents inherit from this. |
| `blogPost.ts` | title, slug, category (ref), author (ref), excerpt, coverImage, body (Portable Text), seo, aiSeo, schemaConfig, faqList, relatedPosts, publishedAt, updatedAt, visibility, redirectSettings | Main content type. Full-featured blog post with SEO, AI SEO, schema config, FAQs, and redirect-on-publish. |
| `category.ts` | name, slug, description, defaultSeo, defaultOgImage | Blog category. The `defaultSeo` fields are inherited by all posts in this category (second level in the inheritance chain). |
| `author.ts` | name, slug, bio, photo, title, expertise, credentials, socials (twitter, linkedin, github, website) | Author profile for E-E-A-T signals. Referenced by blog posts. |
| `landingPageSeo.ts` | title, slug, seo, aiSeo, schemaConfig, faqList, publishedAt, updatedAt, visibility | Lightweight document for managing SEO metadata for code-based landing pages. The slug maps directly to the route (e.g., slug `about` → `/about`, slug `/` → homepage). No page content — just SEO config. |
| `faqItem.ts` | question, answer, order | Standalone FAQ item. Can be referenced by multiple pages. Order field controls display order. |
| `redirect.ts` | fromSlug, toUrl, type (301/302), isActive | URL redirect rule. Fetched by `proxy.js` at the edge and applied before the page renders. |

#### schemaTypes/objects/

Reusable field groups embedded into documents (not standalone documents).

| Object | Fields | Used by |
|---|---|---|
| `seo.ts` | metaTitle, metaDescription, canonicalUrl, ogImage, twitterCard, robots (noindex, nofollow) | blogPost, category, landingPageSeo, siteSettings |
| `aiSeo.ts` | quickAnswer (50-80 words), speakableContent, keyTakeaways (array of strings) | blogPost, landingPageSeo |
| `schemaConfig.ts` | primarySchemaType (enum), enableFaqSchema, enableBreadcrumbSchema, enableArticleSchema | blogPost, landingPageSeo |
| `portableText.ts` | Block array with marks, annotations (link), block types (image, callout, code, cta, table, youtube, faqBlock, divider) | blogPost body |
| `imageWithMeta.ts` | asset (image), alt, caption | Used anywhere a structured image with metadata is needed |
| `faqList.ts` | Array of { question, answer } pairs | blogPost, landingPageSeo (inline FAQ without referencing faqItem) |
| `analyticsConfig.ts` | ga4MeasurementId, gtmContainerId, plausibleDomain, clarityProjectId | siteSettings |
| `link.ts` | type (internal/external), internal (reference to blogPost, category, or author), external (url), label | Portable Text link annotations |
| `redirectSettings.ts` | autoRedirect (bool), keepOldSlugAlive (bool) | blogPost (controls publishWithRedirect behavior) |
| `schemaConfig.ts` | primarySchemaType, enableFaqSchema, enableBreadcrumbSchema | blogPost, landingPageSeo |
| `searchIndexSettings.ts` | includeInSitemap, excludeFromSearch | siteSettings, blogPost |
| `socialDefaults.ts` | defaultShareImage, defaultShareText | siteSettings |

#### structure/index.ts

Defines the Sanity Studio sidebar navigation order and groupings:
- Landing Pages SEO
- Blog Posts
- Categories
- Authors
- FAQ Items
- URL Redirects
- Site Settings

---

## 5. Architecture & Design Decisions

### Landing pages: Code-based content, CMS-based SEO

**The problem with page-builders:** Originally the site had a Sanity `page` document type with 10+ block types (hero, features, pricing, CTA, etc.). This created schema complexity, made landing pages hard to version-control, and tightly coupled content to CMS availability.

**The solution:** Landing page *content* is hardcoded React (`.js` files in `app/[locale]/`). Landing page *SEO metadata* is managed in Sanity via the lightweight `landingPageSeo` document. This gives:
- Editors control over meta titles, descriptions, OG images, JSON-LD schema, and FAQs — without code deploys
- Developers control over page layout, components, and HTML structure — without Studio config
- Clean version control: every layout change is a PR; every SEO tweak is a Studio publish

### SEO inheritance chain

Values are resolved through three levels. Higher-level defaults are used when a lower level doesn't set a value:

```
Site Settings (siteSettings document — global defaults)
    ↓ fallback if unset
Category Defaults (category.defaultSeo — per-topic overrides)
    ↓ fallback if unset
Document (blogPost.seo or landingPageSeo.seo — per-page final values)
```

All resolution happens in `src/seo/resolve.js`. The `buildMetadata()` function in `src/seo/metadata.js` calls these resolvers and returns a Next.js metadata object.

### Blog: Fully CMS-driven

Blog posts, categories, and authors are always fetched from Sanity. Portable Text body supports rich content types (images, code blocks, callouts, YouTube, tables, CTAs, inline FAQs). The blog system is unaffected by any changes to the landing page architecture.

### Routing: Locale-first from day one

Every route lives under `[locale]` (currently `/en/*`). Un-prefixed paths (`/`, `/blog`) are redirected by the edge proxy to `/<DEFAULT_LOCALE><path>`. This costs almost nothing to set up and avoids a painful migration later when adding a second language.

---

## 6. Color System

The entire app's color palette is controlled by three CSS variables in `src/app/globals.css`. **Change only these three values to retheme everything** — buttons, hero, footer, badges, links, card borders:

```css
@theme {
  --color-primary:   #10b981;  /* accents: buttons, badges, links, highlights, star ratings */
  --color-secondary: #0f172a;  /* dark base: navbar, hero bg, dark sections, footer bg */
  --color-tertiary:  #1e293b;  /* elevated surfaces: cards and panels inside dark sections */
}
```

Tailwind v4 promotes `@theme` variables to utility classes automatically:
- `bg-primary`, `text-primary`, `border-primary`, `hover:bg-primary/90`
- `bg-secondary`, `text-secondary`, `bg-tertiary`, `border-tertiary`

No `tailwind.config.js` needed. No rebuilds. Change the hex values and every component using these classes updates automatically.

**Tailwind v4 gotcha:** Do NOT use `@tailwind base; @tailwind components; @tailwind utilities;` — that is v3 syntax and will fail. Use only `@import "tailwindcss";`.

---

## 7. Localization Architecture

The site is locale-ready from day one, with only English active in the MVP. The architecture costs nothing extra if you never add a second language, but adding one later is a one-line change.

### How it works

1. **`src/i18n/config.js`** — Edit `LOCALES` to add/remove active locales. This file is the only file you ever need to touch for routing.
2. **`src/proxy.js`** — Edge proxy reads `LOCALES` and redirects un-prefixed paths to `DEFAULT_LOCALE`. It also fetches active CMS redirect documents.
3. **`src/app/[locale]/layout.js`** — Root layout reads `locale` from params, sets `<html lang>` and `dir` (RTL support), calls `notFound()` for invalid locales.
4. **`src/i18n/routing.js`** — `localizedPath(locale, path)` builds every internal URL. All Navbar/Footer/breadcrumb links call this.

### Adding a locale

1. Open `src/i18n/config.js`
2. Add the locale code: `export const LOCALES = ['en', 'fr']`
3. Add a display label to `LOCALE_LABELS` (e.g., `fr: 'Français'`)
4. If RTL, add to `RTL_LOCALES` (e.g., `['ar']`)

That's it for routing — `/fr/*` paths start working immediately. Then choose a translation strategy:

| Approach | Best for |
|---|---|
| JSON dictionaries in `src/i18n/messages/{en,fr}.json` | UI strings, mostly static text |
| Locale field on Sanity documents + GROQ filter `language == $locale` | CMS-driven content where each translation is its own document |
| Both combined | UI chrome via JSON, content via Sanity |

### Accept-Language auto-detection (optional)

Extend `pickLocale(request)` in `src/proxy.js` to read `request.headers.get('accept-language')`, parse q-values, and return the best match against `LOCALES`. The rest of the proxy is unchanged.

---

## 8. SEO System

### SEO inheritance

See [Architecture section](#seo-inheritance-chain) above.

### buildMetadata()

Every page's `generateMetadata()` calls `buildMetadata({ settings, doc, path, locale })`:

```js
export async function generateMetadata({ params }) {
  const { locale } = await params
  const { settings, seo } = await load()
  return buildMetadata({ settings, doc: seo || {}, path: '/about', locale })
}
```

This returns a complete Next.js metadata object including:
- `title` / `description`
- `openGraph` (title, description, image, url, type, siteName)
- `twitter` (card, title, description, images)
- `alternates` (canonical URL + hreflang for each active locale)
- `robots` (index/noindex, follow/nofollow)

### Canonical URLs

Auto-generated from `SITE_URL + localizedPath(locale, path)`. Can be overridden per-page by setting `seo.canonicalUrl` in Sanity.

### Robots directives

Set `seo.robots.noindex = true` on any document to hide it from search engines. Setting `landingPageSeo.visibility = 'hidden'` also sets noindex automatically.

---

## 9. JSON-LD Schema Generation

Structured data is generated in `src/schema/` and injected via `<JsonLd data={schemas} />`.

### For blog posts

`buildPostSchemas({ post, url, settings, breadcrumbs })` always generates:
- `Article` or `BlogPosting`
- `BreadcrumbList`
- `Person` (author, for E-E-A-T)
- `SpeakableSpecification` (if `aiSeo.speakableContent` is set)
- `FAQPage` (if post has `faqList` items)

### For landing pages

`buildPageSchemas({ page, url, schemaConfig, faqs, breadcrumbs })` generates schemas based on `schemaConfig.primarySchemaType` selected in Studio:

| Schema Type | When to use |
|---|---|
| Organization | Brand/company info, logo, socials — use on every site |
| WebSite | Site metadata + SearchAction — use on every site |
| LocalBusiness | Physical business with address, hours, phone |
| FAQPage | Pages with FAQs (auto-generated if faqList is set) |
| HowTo | Step-by-step guides |
| Product | Product pages with price and availability |
| Review | Review pages with ratings |
| Article / BlogPosting | News/editorial content |

### How editors configure schemas

In Sanity Studio, open any blog post or landing page SEO document → "Schema Config" section:
1. Pick `Primary Schema Type` from the dropdown
2. Toggle `Enable FAQ Schema`, `Enable Breadcrumb Schema`, etc.

The code reads these selections and builds the appropriate JSON-LD automatically.

---

## 10. Analytics

Analytics are configured entirely in Sanity. No code changes needed to add or change providers.

**In Sanity Studio:** Site Settings → Analytics Config:
- **GA4 Measurement ID** (e.g., `G-XXXXXXXXXX`)
- **GTM Container ID** (e.g., `GTM-XXXXXXX`)
- **Plausible Domain** (e.g., `yourdomain.com`)
- **Clarity Project ID** (e.g., `xxxxxxxxxx`)

Leave a field blank to disable that provider. The `src/analytics/index.js` loader reads these values and injects only the non-empty ones.

---

## 11. Draft Preview

Draft preview lets editors see unpublished content before publishing.

### Setup

1. Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. In `apps/web/.env.local`: set `SANITY_PREVIEW_SECRET=<your-secret>` and `SANITY_API_READ_TOKEN=<viewer-token-from-sanity-manage>`
3. In `apps/studio/.env`: set `SANITY_STUDIO_PREVIEW_SECRET=<same-secret>` and `SANITY_STUDIO_PREVIEW_URL=http://localhost:3000`

### How it works

1. Editor opens a document in Studio
2. Clicks the Preview tab → Studio calls `/api/draft-mode/enable?secret=...&redirect=/en/blog/my-post`
3. Next.js validates the secret, sets a Draft Mode cookie, redirects to the path
4. `sanityFetch()` detects the Draft Mode cookie and switches to the draft CDN (bypasses cache, uses `SANITY_API_READ_TOKEN` to read unpublished drafts)
5. `DraftModeBanner` is shown at the top of the page
6. Editor clicks "Disable preview" → calls `/api/draft-mode/disable` → clears the cookie

---

## 12. On-Demand Revalidation

When an editor publishes in Sanity, the Next.js ISR cache is purged within seconds via webhook.

### Setup

1. Go to [sanity.io/manage](https://sanity.io/manage) → API → Webhooks → Create webhook
2. **URL:** `https://yoursite.com/api/revalidate`
3. **Method:** `POST`
4. **HTTP Headers:** `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`
5. **Filter:** `*[_type in ["blogPost","category","landingPageSeo","siteSettings","redirect","author","faqItem"]]`
6. Set `SANITY_REVALIDATE_SECRET` in `apps/web/.env.local` (and on Vercel)

When Sanity sends the webhook, `route.js` validates the secret, determines the document type from the payload, calls `revalidateTag('blogPost')` (or whichever type changed), and Next.js purges all pages tagged with that key.

---

## 13. Routing Map

The proxy at `src/proxy.js` handles the locale redirect. Actual page files live under `app/[locale]/`.

| URL | File | Render mode | Data source |
|---|---|---|---|
| `/` | Proxy redirect → `/en` | — | — |
| `/blog` | Proxy redirect → `/en/blog` | — | — |
| `/en` | `app/[locale]/page.js` | ISR (revalidate on publish) | `landingPageSeo` (slug `/`) |
| `/en/blog` | `app/[locale]/blog/page.js` | Dynamic | `blogPost` (all published) |
| `/en/blog/[slug]` | `app/[locale]/blog/[slug]/page.js` | ISR + SSG | `blogPost` (single) |
| `/en/blog/category/[slug]` | `app/[locale]/blog/category/[slug]/page.js` | ISR | `category` + `blogPost` |
| `/en/author/[slug]` | `app/[locale]/author/[slug]/page.js` | ISR | `author` + `blogPost` |
| `/sitemap.xml` | `app/sitemap.js` | Dynamic | `blogPost`, `category`, `author` |
| `/robots.txt` | `app/robots.js` | Dynamic | `SITE_URL` env var |
| `/api/draft-mode/enable` | `app/api/draft-mode/enable/route.js` | Edge | — |
| `/api/draft-mode/disable` | `app/api/draft-mode/disable/route.js` | Edge | — |
| `/api/revalidate` | `app/api/revalidate/route.js` | Serverless | Sanity webhook payload |

---

## 14. Environment Variables

### apps/web/.env.local

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Your Sanity project ID — find at sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name, usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | ISO date string, e.g. `2025-01-01` |
| `SANITY_API_READ_TOKEN` | For drafts | Viewer-role token from sanity.io/manage → API → Tokens |
| `SANITY_PREVIEW_SECRET` | For drafts | Random 32-byte hex string (must match studio env var) |
| `SANITY_REVALIDATE_SECRET` | For webhooks | Any secret string; used in the Sanity webhook header |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Full URL with protocol, e.g. `https://yourdomain.com` |

Generate secrets with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### apps/studio/.env

| Variable | Required | Description |
|---|---|---|
| `SANITY_STUDIO_PROJECT_ID` | Yes | Same project ID as the web app |
| `SANITY_STUDIO_DATASET` | Yes | Same dataset name |
| `SANITY_STUDIO_PREVIEW_URL` | For drafts | `http://localhost:3000` locally, or your Vercel URL in production |
| `SANITY_STUDIO_PREVIEW_SECRET` | For drafts | Same value as `SANITY_PREVIEW_SECRET` in the web app |

---

## 15. Quick Start

### Step 1: Install dependencies

Always run from the monorepo root:

```bash
npm install
```

Never run `npm install` inside `apps/web` or `apps/studio`. The workspace hoists everything to root `node_modules/`.

### Step 2: Create a Sanity project

Sign up at [sanity.io](https://www.sanity.io) → create a new project. Note your **Project ID** and **Dataset** (default: `production`).

### Step 3: Configure environment variables

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/studio/.env.example apps/studio/.env
```

Fill in both files. Minimum required for local dev:

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Both files |
| `NEXT_PUBLIC_SANITY_DATASET` | `apps/web/.env.local` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `apps/web/.env.local` |

### Step 4: Set Sanity project ID in Studio config

Open `apps/studio/sanity.config.ts` and `apps/studio/sanity.cli.ts`. Replace `YOUR_PROJECT_ID` with your actual project ID.

### Step 5: Run both apps

```bash
# Both apps together (recommended)
npm run dev

# Or individually
npm run dev:web    # http://localhost:3000
npm run dev:studio # http://localhost:3333
```

### Step 6: Populate initial content in Sanity Studio

Create content in this order:

1. **Site Settings** — Set brand name, site URL, default SEO description, logo, and social profiles. Everything else inherits from here.
2. **Landing Pages SEO** — Create a document with slug `/` for the homepage. Fill in meta title and description.
3. **Categories** — Create at least one category (e.g., "Technology", "Business").
4. **Authors** — Create an author with name, bio, and photo.
5. **Blog Posts** — Create a post, assign author and category, write content in the body editor, and publish.

---

## 16. How To: Common Tasks

### Add a Landing Page

Landing pages are built in code; their SEO is managed in Sanity.

**Step 1: Create the page file**

```
apps/web/src/app/[locale]/services/page.js
```

**Step 2: Use this template**

```js
import { sanityFetch } from '@/sanity/lib/fetch'
import { LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'
import { buildMetadata } from '@/seo'
import { resolveFaq, resolveSchemaConfig } from '@/seo/resolve'
import { buildPageSchemas } from '@/schema'
import FAQSection from '@/components/shared/FAQSection'
import JsonLd from '@/components/shared/JsonLd'
import { SITE_URL } from '@/constants/site'
import { localizedPath } from '@/i18n/routing'

async function load() {
  const [settings, seo] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: LANDING_PAGE_SEO_QUERY, params: { slug: 'services' }, tags: ['landingPageSeo'] }),
  ])
  return { settings, seo }
}

export async function generateMetadata({ params }) {
  const { locale } = await params
  const { settings, seo } = await load()
  return buildMetadata({ settings, doc: seo || {}, path: '/services', locale })
}

export default async function ServicesPage({ params }) {
  const { locale } = await params
  const { settings, seo } = await load()

  const schemaConfig = resolveSchemaConfig({ settings, doc: seo || {} })
  const faqs = resolveFaq({ doc: seo || {} })
  const url = `${SITE_URL}${localizedPath(locale, '/services')}`
  const schemas = seo ? buildPageSchemas({ page: seo, url, schemaConfig, faqs, breadcrumbs: [] }) : []

  return (
    <main>
      {/* Your hardcoded content here */}
      <h1>Our Services</h1>

      {faqs.length ? <FAQSection faqs={faqs} /> : null}
      <JsonLd data={schemas} />
    </main>
  )
}
```

**Step 3: Create the Sanity document**

Studio → Landing Pages SEO → Create → title "Services" → slug auto-fills as `services` → fill SEO fields → Publish.

**Step 4: Add to sitemap**

In `src/app/sitemap.js`, add `add('/services')` in the core routes section.

---

### Add a Locale

1. Open `src/i18n/config.js`
2. Add the code to `LOCALES`: `export const LOCALES = ['en', 'fr']`
3. Add a display label: `LOCALE_LABELS: { ..., fr: 'Français' }`
4. If RTL: add to `RTL_LOCALES`: `['ar']`

Routing, canonical URLs, hreflang alternates, the sitemap, and `generateStaticParams` all adapt automatically. No other files need changes.

---

### Add a New Sanity Content Type

1. Create `apps/studio/schemaTypes/documents/myType.ts` with `defineType()`
2. Import it in `apps/studio/schemaTypes/documents/index.ts` and add to the array
3. Import it in `apps/studio/schemaTypes/index.ts` and add to `schemaTypes`
4. (Optional) Add it to `apps/studio/structure/index.ts` to control its position in the sidebar
5. Write a GROQ query in `apps/web/src/sanity/queries/myType.js`
6. Add a JSDoc typedef to `apps/web/src/sanity/types/index.js`
7. Fetch with `sanityFetch({ query: MY_QUERY, tags: ['myType'] })` in any server component

---

### Add a New Blog Category

1. In Sanity Studio → Categories → Create new
2. Set name and slug (auto-generates from name)
3. Optionally set `defaultSeo` fields (these will be inherited by all posts in this category)
4. Publish

---

### Manage Redirects

**CMS redirect (recommended):**
1. Studio → URL Redirects → Create new
2. Set `fromSlug` (the old path, e.g., `old-page`)
3. Set `toUrl` (the new destination, e.g., `/en/new-page` or an absolute URL)
4. Set `type` (301 for permanent, 302 for temporary)
5. Toggle `isActive = true`
6. Publish

The proxy reads active redirect documents at the edge and applies them before the page renders. No code deploy needed.

**For blog post slug changes:** The `publishWithRedirect` action does this automatically. When you change a blog post's slug and publish, Sanity creates a redirect from the old slug to the new one without any manual steps.

---

## 17. SEO Fields Explained

### In the Sanity Studio document editor

| Field | Limit | Description |
|---|---|---|
| **Meta Title** | ≤60 chars (warn at 60, error at 70) | Shown in browser tab and Google search results. Put the target keyword first, brand name at end. |
| **Meta Description** | 150–160 chars (warn at 160, error at 180) | Shown under the title in search results. Include a call-to-action. Not a ranking factor but affects click-through rate. |
| **Canonical URL** | — | Leave blank for auto-generation. Set only if this page is a duplicate of another URL. |
| **OG Image** | 1200×630px | Image shown when shared on LinkedIn, Facebook, Slack, etc. Falls back to category → site default. |
| **Twitter Card** | — | Overrides OG image/text for Twitter/X previews. Usually leave blank to inherit from OG. |
| **Robots** | — | `noindex` hides the page from Google. `nofollow` stops Google following links from this page. |
| **Quick Answer** | 50–80 words | A concise answer to the page's primary question. Targets Google featured snippets and AI Overviews. |
| **Speakable Content** | — | Voice-search-optimized version of the quick answer for Google Assistant / Alexa. |
| **Key Takeaways** | 3–7 bullets | Bulleted summary of main points. Helps with AI Overviews. |
| **Primary Schema Type** | Dropdown | The JSON-LD type best representing the page. See [JSON-LD section](#9-json-ld-schema-generation). |
| **Visibility** | Published/Hidden | Hidden sets `noindex, nofollow` automatically. |

---

## 18. Sanity Studio: Content Types Reference

### Site Settings (singleton)

**Where:** Studio → Site Settings

This is the global baseline. All SEO fields here are inherited by every page unless overridden. Fill this in first before creating any other content.

Key fields:
- `brandName` — used in page titles, OG, and JSON-LD organization name
- `siteUrl` — used for canonical URLs and sitemap. Must match your live domain.
- `defaultSeo` — fallback meta title pattern and description
- `analyticsConfig` — GA4, GTM, Plausible, Clarity IDs
- `socialProfiles` — Twitter, LinkedIn, GitHub, YouTube URLs (used in Organization JSON-LD)

### Blog Post

**Where:** Studio → Blog Posts → New

Full document schema:
- **Content:** title, slug (auto from title), category (reference), author (reference), excerpt (shown in listing), coverImage, body (Portable Text rich editor)
- **Publishing:** publishedAt, updatedAt, visibility, redirectSettings (auto-redirect on slug change)
- **SEO:** metaTitle, metaDescription, canonicalUrl, ogImage, robots
- **AI SEO:** quickAnswer, speakableContent, keyTakeaways
- **Schema Config:** primarySchemaType, enableFaqSchema, enableBreadcrumbSchema
- **Related Posts:** array of post references (shown at bottom of post detail)
- **FAQ:** inline FAQ list (generates FAQPage JSON-LD)

### Landing Page SEO

**Where:** Studio → Landing Pages SEO → New

Lightweight document — no content, only metadata:
- **Identifier:** title (display name), slug (maps to route)
- **SEO:** metaTitle, metaDescription, ogImage, canonicalUrl, robots
- **AI SEO:** quickAnswer, speakableContent, keyTakeaways
- **Schema Config:** primarySchemaType (Organization/WebSite/LocalBusiness/etc.)
- **FAQ:** optional inline FAQ list
- **Visibility:** Published/Hidden

Common slug values:
| Slug | Route |
|---|---|
| `/` | Homepage (`/en`) |
| `about` | `/en/about` |
| `contact` | `/en/contact` |
| `services` | `/en/services` |
| `pricing` | `/en/pricing` |

### Category

**Where:** Studio → Categories → New

- name, slug (auto from name)
- description (shown on category archive page)
- `defaultSeo` — inherited by all blog posts in this category

### Author

**Where:** Studio → Authors → New

- name, slug (auto from name)
- photo, bio, title (job title), expertise (array of topic strings)
- credentials (professional credentials, degrees — for E-E-A-T)
- socials: twitter, linkedin, github, website

### FAQ Item

**Where:** Studio → FAQ Items → New

Standalone FAQ that can be referenced in multiple places:
- question (string)
- answer (text)
- order (number — lower appears first)

### URL Redirect

**Where:** Studio → URL Redirects → New

- fromSlug (the old path segment, without leading slash, e.g., `old-page`)
- toUrl (destination, can be a path or absolute URL)
- type: 301 (permanent) or 302 (temporary)
- isActive (toggle off to disable without deleting)

---

## 19. Deployment

### Web → Vercel

1. Push the repo to GitHub
2. Import at [vercel.com](https://vercel.com/new) → pick the repo
3. **Set Root Directory to `apps/web`** — this is the most critical setting
4. Add all environment variables from `apps/web/.env.local` to Vercel (Production, Preview, Development environments)
5. Deploy

**Common Vercel issues:**

| Issue | Cause | Fix |
|---|---|---|
| `Cannot find module 'lightningcss.linux-x64-gnu.node'` | Windows lockfile missing Linux native binaries | Pin `lightningcss-linux-x64-gnu`, `@tailwindcss/oxide-linux-x64-gnu`, `@next/swc-linux-x64-gnu` in `optionalDependencies` in `apps/web/package.json` and reinstall |
| `Missing script "build:web"` | Vercel runs commands from `apps/web/`, not root | Keep `"build:web": "next build"` alias in `apps/web/package.json` |
| Sanity queries return empty on Vercel | Env vars not set on Vercel | Add `NEXT_PUBLIC_SANITY_*` vars in Vercel dashboard |

### Studio → Sanity Hosting

```bash
cd apps/studio
npx sanity deploy
```

Pick a studio name when prompted. The studio will be available at `<name>.sanity.studio`.

After deploying, go to [sanity.io/manage](https://sanity.io/manage) → API → CORS Origins → Add your Vercel domain (e.g., `https://yoursite.vercel.app` and `https://yourdomain.com`). Without this, the Studio cannot communicate with your Sanity dataset from the web.

### Revalidation webhook (production)

After deploying, set up the Sanity webhook (see [Section 12](#12-on-demand-revalidation)) pointing to your Vercel URL.

---

## 20. Command Reference

All commands run from the **monorepo root** unless otherwise noted.

| Command | What it does |
|---|---|
| `npm install` | Install all dependencies for both workspaces |
| `npm run dev` | Run web (`:3000`) and studio (`:3333`) in parallel via `concurrently` |
| `npm run dev:web` | Run Next.js only |
| `npm run dev:studio` | Run Sanity Studio only |
| `npm run build` | Build web then studio |
| `npm run build:web` | Build Next.js only (what Vercel calls) |
| `npm run build:studio` | Build Studio only |
| `npm run lint -w apps/web` | Run ESLint on the web app |
| `npm run lint -w apps/studio` | Run ESLint on the studio |
| `npx sanity deploy` | (from `apps/studio`) Deploy Studio to Sanity hosting |
| `npx sanity dataset export production backup.tar.gz` | (from `apps/studio`) Export dataset backup |

---

## 21. Known Gotchas

| Symptom | Cause | Fix |
|---|---|---|
| `params.locale` or `params.slug` is `undefined` | Next.js 15+ made `params` async | Always `const { locale, slug } = await params` |
| Anchor links don't scroll when coming from another page | Using `<Link>` for hash hrefs | Use plain `<a>` for hash links (e.g., `/#section1`). Always build hrefs via `localizedPath(locale, '/#section1')` |
| Sanity images not loading | `cdn.sanity.io` not in allowed image domains | Ensure `remotePatterns` in `next.config.mjs` includes `{ protocol: 'https', hostname: 'cdn.sanity.io' }` |
| `apps/web` files missing from git push | Nested `.git` directory inside `apps/web` (treats it as a submodule) | `Remove-Item -Recurse -Force apps\web\.git` then re-stage all files |
| Blog / FAQ shows nothing | Documents are saved as drafts, not published | Go to Studio → click the document → click "Publish" |
| Hydration error mentioning `data-new-gr-c-s-check-loaded` | Browser extension (Grammarly, Dark Reader) injecting attrs on `<body>` | `suppressHydrationWarning` on `<body>` in `layout.js` already handles this |
| Build warns `The "middleware" file convention is deprecated` | Still using `middleware.js` | Rename to `src/proxy.js`, export function as `proxy` (or default) |
| `npm install` shows deprecation warnings for `uuid@8`, `uuid@10`, `mute-stream@4` | Transitive deps of Sanity CLI in `apps/studio` | Harmless; do not force-upgrade. `uuid@8`/`10`→`11` has breaking API differences. Will resolve when Sanity updates |
| Studio schema error: Unknown type | A document references a deleted type | Check `link.ts` and other objects for references to removed document types. Internal links can only reference: `blogPost`, `category`, `author` |
| SEO metadata not updating after publish | Revalidation webhook not configured | Set up the Sanity webhook (Section 12). In local dev, restart `npm run dev` after publishing |
| Preview not working | Secret mismatch or token missing | Confirm `SANITY_PREVIEW_SECRET` = `SANITY_STUDIO_PREVIEW_SECRET`, and `SANITY_API_READ_TOKEN` is a Viewer token |
| Vercel build: `Cannot find module 'lightningcss-linux-x64-gnu.node'` | Windows-generated `package-lock.json` omits Linux binaries | Add Linux binaries to `optionalDependencies` in `apps/web/package.json` and re-run `npm install` on Windows before pushing |
