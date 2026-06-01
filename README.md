# Next.js + Sanity Publishing Platform

A reusable, CMS-first publishing platform starter built on **Next.js 16** (App Router, JavaScript) and **Sanity Studio v5** (TypeScript). Everything that affects ranking, discoverability, sharing, AI visibility, or indexing is editable in Sanity — code only renders.

> **Data flow:** Sanity CMS → Next.js → Rendered Website

---

## Features

- **Blog system** — posts, categories, authors with full Sanity content management
- **Landing page SEO** — manage meta titles, descriptions, OG images, and JSON-LD schema for code-built pages from Sanity, no code changes needed
- **JSON-LD schema generation** — Article, BlogPosting, FAQPage, BreadcrumbList, Person, Organization, WebSite, and more; configurable per-document from Sanity
- **SEO inheritance** — Site Settings → Category → Document; set once at the highest level, override where needed
- **AI SEO** — Quick Answer, Key Takeaways, Speakable schema for Google AI Overviews, voice search, and ChatGPT Search
- **Draft preview** — Sanity Presentation tool + Next.js draft cookies; live preview of unpublished content
- **On-demand revalidation** — Sanity webhook → `/api/revalidate` → `revalidateTag()` → ISR cache purged in seconds
- **Multi-language routing** — `[locale]` URL segment; add a locale in one line in `i18n/config.js`
- **Redirect management** — editor-managed 301/302 redirects via Sanity `redirect` documents
- **Analytics** — CMS-driven: GA4, GTM, Plausible, Clarity — configure IDs in Sanity, zero code changes
- **Portable Text** — rich blog content with images, tables, callouts, YouTube embeds, CTAs, FAQs, code blocks

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router, JavaScript) |
| Styling | Tailwind CSS v4 |
| CMS | Sanity Studio v5 (TypeScript) |
| Icons | lucide-react |
| Routing | Locale-prefixed `/[locale]/...` via Next.js proxy middleware |
| Deployment | Vercel (web) · Sanity Hosting (studio) |

---

## Project Structure

```
apps/
├── web/                          # Next.js 16 frontend (JavaScript)
│   ├── src/
│   │   ├── app/[locale]/         # All routes under locale segment
│   │   │   ├── layout.js         # Root layout: Navbar, Footer, JSON-LD, analytics
│   │   │   ├── page.js           # Homepage (content in code, SEO from Sanity)
│   │   │   ├── blog/             # Blog listing + post + category routes
│   │   │   └── api/              # draft-mode/enable|disable, revalidate
│   │   ├── components/
│   │   │   ├── blog/             # PostBody, BlogCard, AuthorCard, ToC, QuickAnswer…
│   │   │   ├── shared/           # Navbar, Footer, Breadcrumbs, FAQSection, JsonLd…
│   │   │   └── ui/               # Container, Button, Badge, Callout, Prose…
│   │   ├── sanity/
│   │   │   ├── lib/              # client, fetch (ISR + draft), image, api
│   │   │   ├── queries/          # All GROQ queries (fragments, posts, pages, etc.)
│   │   │   └── types/            # JSDoc typedefs for Sanity content shapes
│   │   ├── schema/               # JSON-LD generators (Article, FAQ, Person, Org…)
│   │   ├── seo/                  # buildMetadata, resolve (inheritance), hreflang…
│   │   ├── utils/                # format, resolveHref, portable-text, embed
│   │   ├── analytics/            # CMS-driven analytics provider loader
│   │   ├── search/               # Placeholder for future search integration
│   │   ├── constants/            # SITE_URL, SITE_NAME
│   │   ├── hooks/                # useTableOfContents
│   │   ├── i18n/                 # config, routing, utils
│   │   ├── proxy.js              # Middleware: locale redirect + redirect docs
│   │   └── app/globals.css       # Tailwind base + CSS custom properties
│   ├── .env.example              # Template for .env.local
│   └── .gitignore
└── studio/                       # Sanity Studio v5 (TypeScript)
    ├── schemaTypes/
    │   ├── documents/            # landingPageSeo, blogPost, category, author, redirect, siteSettings, faqItem
    │   ├── objects/              # seo, aiSeo, schemaConfig, portableText, imageWithMeta, faqList, link…
    │   ├── components/           # CharacterCount, SeoChecklist, SeoPreview, SchemaPreview, PreviewPane
    │   └── actions/              # publishWithRedirect (auto slug history)
    ├── structure/                # Sidebar navigation
    ├── sanity.config.ts          # Plugins: structureTool, presentationTool, visionTool
    ├── sanity.css                # Studio custom styles
    ├── env.d.ts                  # TypeScript declarations for env vars
    ├── .env.example              # Template for .env.local
    └── .gitignore
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Sanity project

Sign up at [sanity.io](https://www.sanity.io) and create a new project. Note your **Project ID** and **Dataset** name.

### 3. Configure environment variables

```bash
# Web app
cp apps/web/.env.example apps/web/.env.local

# Studio
cp apps/studio/.env.example apps/studio/.env.local
```

Fill in both files. See comments inside each `.env.example` for where to find each value.

**Minimum required for local dev:**

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | [sanity.io/manage](https://sanity.io/manage) → Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (default) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2025-01-01` |
| `SANITY_API_READ_TOKEN` | sanity.io/manage → API → Tokens → Viewer role |
| `SANITY_PREVIEW_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SANITY_STUDIO_PREVIEW_SECRET` | Same value as `SANITY_PREVIEW_SECRET` |

### 4. Update Sanity project config

In `apps/studio/sanity.config.ts`, set your `projectId` and `dataset`.

### 5. Run both apps

```bash
# Next.js web app — http://localhost:3000
npm run dev:web

# Sanity Studio — http://localhost:3333
npm run dev:studio
```

### 6. Populate initial content

In Sanity Studio, create:
1. **Site Settings** — set your brand name, URL, default SEO, social profiles
2. **Landing Pages SEO** — create a document with slug `/` for your homepage
3. **Categories** — create at least one category for blog posts
4. **Authors** — create an author for blog posts
5. **Blog Posts** — create your first post, assign author and category

---

## SEO Inheritance

Values resolve through three levels — set once at the highest appropriate level:

```
Site Settings (global defaults)
    ↓
Category Defaults (per-topic overrides)
    ↓
Document (per-page final values)
```

If a blog post has no meta description, it inherits from its category. If the category has none, it falls back to Site Settings.

---

## Adding a Landing Page

Landing pages are **built in code** with SEO managed in Sanity.

1. **Create the page file:**
```
apps/web/src/app/[locale]/about/page.js
```

2. **Fetch SEO from Sanity:**
```js
import {LANDING_PAGE_SEO_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'

async function load() {
  const [settings, seo] = await Promise.all([
    sanityFetch({query: SITE_SETTINGS_QUERY, tags: ['siteSettings']}),
    sanityFetch({query: LANDING_PAGE_SEO_QUERY, params: {slug: 'about'}, tags: ['landingPageSeo']}),
  ])
  return {settings, seo}
}

export async function generateMetadata({params}) {
  const {locale} = await params
  const {settings, seo} = await load()
  return buildMetadata({settings, doc: seo || {}, path: '/about', locale})
}
```

3. **Create a Sanity document:** Studio → Landing Pages SEO → New document with slug `about`

4. **Add to sitemap:** In `app/sitemap.js`, add `add('/about')` in the core routes section.

---

## Adding a Locale

1. Open `apps/web/src/i18n/config.js`
2. Add the locale code to `LOCALES`: e.g. `['en', 'fr']`
3. Add a display name to `LOCALE_LABELS`
4. If RTL, add to `RTL_LOCALES`

Routing, canonical URLs, hreflang alternates, and the sitemap all adapt automatically.

---

## Draft Preview Setup

1. Set matching secrets in both `.env.local` files (`SANITY_PREVIEW_SECRET` = `SANITY_STUDIO_PREVIEW_SECRET`)
2. Set `SANITY_STUDIO_PREVIEW_URL=http://localhost:3000` in `apps/studio/.env.local`
3. Set `SANITY_API_READ_TOKEN` in `apps/web/.env.local`
4. Open Studio → any document → Preview tab → click the draft preview link

---

## Revalidation Webhook

1. Go to [sanity.io/manage](https://sanity.io/manage) → API → Webhooks → Create
2. URL: `https://yoursite.com/api/revalidate`
3. Method: `POST`
4. Secret: your `SANITY_REVALIDATE_SECRET` value
5. Filter: `*[_type in ["blogPost","category","landingPageSeo","siteSettings","redirect"]]`

---

## Deployment

### Web → Vercel
1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `apps/web`
3. Add all `NEXT_PUBLIC_SANITY_*` and server-side secrets as environment variables
4. Deploy

### Studio → Sanity Hosting
```bash
cd apps/studio
npx sanity deploy
```

After deploying, add your Vercel domain to **CORS Origins** in [sanity.io/manage](https://sanity.io/manage).

---

## Customising for a New Project

1. Update `projectId` and `dataset` in `apps/studio/sanity.config.ts`
2. Fill in `apps/web/.env.local` and `apps/studio/.env.local`
3. Open Sanity Studio → **Site Settings** → set your brand name, URL, description, and social profiles
4. All SEO, schema, and analytics pick up the new values automatically — no code changes needed

---

## Key Files Reference

| File | Purpose |
|---|---|
| `apps/web/src/proxy.js` | Locale redirect middleware + CMS redirect documents |
| `apps/web/src/sanity/lib/fetch.js` | Central Sanity fetch (ISR + draft mode) |
| `apps/web/src/sanity/queries/` | All GROQ queries |
| `apps/web/src/seo/resolve.js` | SEO inheritance resolvers |
| `apps/web/src/seo/metadata.js` | `buildMetadata()` — used by every `generateMetadata()` |
| `apps/web/src/schema/index.js` | JSON-LD orchestration (`buildPostSchemas`, `buildPageSchemas`) |
| `apps/web/src/i18n/config.js` | Active locales — edit this to add a new language |
| `apps/web/src/constants/site.js` | `SITE_URL`, `SITE_NAME` fallbacks |
| `apps/studio/sanity.config.ts` | Studio plugins, presentation tool, document actions |
| `apps/studio/structure/index.ts` | Studio sidebar navigation |
