# Monorepo — Next.js + Sanity

A monorepo containing the Next.js web app and Sanity Studio for content management.

**Docs:**
- [`GUIDE.md`](GUIDE.md) — human-readable walkthrough of how the project is built and why
- [`AGENT_BLUEPRINT.md`](AGENT_BLUEPRINT.md) — verbatim reproduction spec for AI agents

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| CMS | Sanity Studio v5 |
| Routing | Locale-prefixed (`/[locale]/...`) via Next.js 16 `proxy` |
| Deployment | Vercel (web) · Sanity Hosting (studio) |

## Structure

```
apps/
├── web/                              # Next.js frontend
│   ├── src/
│   │   ├── proxy.js                  # Locale redirect (Next 16 renamed middleware → proxy)
│   │   ├── i18n/                     # Localization scaffold (lightweight, no library)
│   │   │   ├── config.js             # LOCALES, DEFAULT_LOCALE, RTL_LOCALES
│   │   │   ├── utils.js              # isValidLocale, getLocaleFromPathname, ...
│   │   │   └── routing.js            # localizedPath, replaceLocale
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   └── [locale]/             # Every page lives under the locale segment
│   │   │       ├── layout.js         # Root layout (sets <html lang>/dir)
│   │   │       ├── page.js           # Landing page
│   │   │       └── blog/
│   │   │           ├── page.js       # Blog listing
│   │   │           └── [slug]/       # Blog post detail
│   │   ├── components/               # UI components (Navbar/Footer take a locale prop)
│   │   └── sanity/lib/               # Sanity client
│   └── .env.example
└── studio/                           # Sanity Studio
    └── schemaTypes/
        ├── blogPost.ts               # Blog post schema
        └── faqItem.ts                # FAQ schema
```

## Getting Started

Install all dependencies from the root:

```bash
npm install
```

> You'll see a few `npm warn deprecated` lines during install (`uuid@8`, `uuid@10`, `whatwg-encoding@3`) and a `mute-stream@4` engine warning. These all come from Sanity CLI's transitive deps — they're cosmetic, do not affect build or runtime, and will go away when Sanity publishes updates upstream.

Copy the env file and fill in your Sanity credentials:

```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Found at sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | e.g. `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ISO date, e.g. `2026-05-26` |
| `SANITY_API_READ_TOKEN` | Optional — needed for draft previews |

Run apps:

```bash
# Next.js — http://localhost:3000  (proxy redirects "/" → "/en")
npm run dev:web

# Sanity Studio — http://localhost:3333
npm run dev:studio
```

## Localization

Routing is locale-prefixed from day one. The MVP serves English only, but adding a locale is purely additive:

1. Open `apps/web/src/i18n/config.js`
2. Add the new code to `LOCALES`: e.g. `['en', 'fr']`
3. (Optional) Add a `LOCALE_LABELS` entry and, for RTL languages, push to `RTL_LOCALES`

The proxy, layout, and link helpers (`localizedPath`, `replaceLocale`) pick the new locale up automatically — routes like `/fr/blog/my-post` will start working immediately. Translation strings and CMS-side language fields are left as project decisions; the routing scaffold doesn't lock you to any i18n library.

See [`GUIDE.md`](GUIDE.md) (Phase 7) for the narrative walkthrough, or [`AGENT_BLUEPRINT.md`](AGENT_BLUEPRINT.md) for the full file contents.

## Sanity Content

Manage content at [sanity.io/manage](https://www.sanity.io/manage) or via the Studio.

| Schema | Fields |
|---|---|
| `blogPost` | title, slug, category, excerpt, coverImage, publishedAt, body |
| `faqItem` | question, answer, order |

## Deployment

### Web → Vercel
1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `apps/web` (Vercel auto-detects Next.js from there)
3. Under **Environment Variables**, add the three `NEXT_PUBLIC_SANITY_*` values from `.env.example` (Production, Preview, Development)
4. Deploy

> The blog and FAQ render dynamically at request time, so the build does not depend on Sanity being reachable. If the env vars are missing the site still deploys — those sections just render empty.

### Studio → Sanity Hosting
```bash
cd apps/studio
npx sanity deploy
```

After deploying, add your Vercel domain to **CORS Origins** in [sanity.io/manage](https://www.sanity.io/manage).
