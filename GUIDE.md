# Building the Monorepo — A Walkthrough

This is the narrative companion to [AGENT_BLUEPRINT.md](AGENT_BLUEPRINT.md). The blueprint is a verbatim reproduction spec; this guide is the story of how the project is built and why each piece is there. Read this if you're spinning up a new project from the same starting point, onboarding to this codebase, or just want to understand the shape of the thing before diving into files.

If you want copy-paste-exact file contents, jump to the blueprint. If you want to understand "what am I actually doing and why," stay here.

---

## What we're building

A two-app monorepo:

- **`apps/web`** — a Next.js 16 site (App Router, React 19, Tailwind v4). Landing page with a hero, three content sections, testimonials, a Sanity-powered FAQ. Plus a blog (listing + post detail) that pulls everything from Sanity.
- **`apps/studio`** — a Sanity Studio v5 to author the content. Two schemas to start: `blogPost` and `faqItem`.

They share one `node_modules/` via npm workspaces. One `npm install` at the root installs both. One `npm run dev` runs both in parallel.

Everything else — locale-prefixed routing, deployment, the color theme system — is layered on top of that base.

## Stack and the choices behind it

| Layer | What | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components by default, file-based routing, built-in image optimization, edge-deployable proxy/middleware |
| Language | JavaScript (in `apps/web`) | Less ceremony for a starter; type-checking still possible via JSDoc + `tsc --checkJs`. Studio stays TypeScript because Sanity expects it. |
| Styling | Tailwind v4 | A single `@import "tailwindcss"` + a `@theme` block defines the entire color system. No `tailwind.config.js` to maintain. |
| CMS | Sanity v5 (`next-sanity` v13 on the web side) | GROQ queries are concise, hosted Studio is one command to deploy, free tier is generous |
| Package manager | npm only | One toolchain. npm workspaces handle the monorepo. No yarn / pnpm / bun. |
| Dev runner | `concurrently` | Runs web and studio together with prefixed logs |
| Deployment | Vercel (web) · Sanity Hosting (studio) | Free, fast, no infra to manage |

---

## Phase 1 — Scaffold the monorepo root

Start from an empty directory. The end state of this phase: a root `package.json` declaring two workspaces, a single root `.gitignore`, no apps yet.

```bash
mkdir my-project && cd my-project
git init
mkdir apps
npm init -y
```

Then edit the root `package.json` to declare workspaces and useful scripts:

```json
{
  "name": "monorepo",
  "private": true,
  "workspaces": ["apps/web", "apps/studio"],
  "scripts": {
    "dev":         "concurrently -n web,studio \"npm run dev -w apps/web\" \"npm run dev -w apps/studio\"",
    "dev:web":     "npm run dev -w apps/web",
    "dev:studio":  "npm run dev -w apps/studio",
    "build":       "npm run build -w apps/web && npm run build -w apps/studio",
    "build:web":   "npm run build -w apps/web",
    "build:studio":"npm run build -w apps/studio"
  },
  "devDependencies": { "concurrently": "^9" }
}
```

The `dev` script runs both apps in parallel. `dev:web` / `dev:studio` run them individually. `build:web` is the one Vercel will call.

Write a **single** root `.gitignore`. Cover `node_modules`, `.next/`, `dist/`, `.sanity/`, `.env`, `.env*.local` (but **not** `.env.example`), editor folders like `.vscode/` / `.idea/` / `.claude/`, OS junk (`.DS_Store`, `Thumbs.db`), the `.vercel/` directory, and a `*-setup.md` rule if you want your scratch notes ignored.

Don't put a separate `.gitignore` inside `apps/web` or `apps/studio`. The single root file covers everything via path patterns.

## Phase 2 — Scaffold `apps/web` (Next.js)

```bash
cd apps
npx create-next-app@latest web \
  --js --app --tailwind --eslint --src-dir --turbopack \
  --no-typescript --no-import-alias
cd web
```

> **Critical first step after scaffolding:** delete the nested `.git` that `create-next-app` makes. If you don't, the parent repo will treat `apps/web` as a submodule and `git push` from the root will quietly exclude every file in it.
>
> ```bash
> rm -rf .git           # Linux/Mac
> Remove-Item -Recurse -Force .git    # Windows PowerShell
> ```

### Remove the boilerplate

The CRA-style default page is in the way. Strip it down:

- **Empty out `src/app/globals.css`.** Replace with one `@import "tailwindcss"` line and a `@theme` block defining the three brand color variables (see Phase 5).
- **Empty out `src/app/page.js`.** Reduce to a single `<main>` with a placeholder heading. You'll fill it back in once components exist.
- **Delete `src/app/favicon.ico`** unless you have your own ready.
- **Wipe `public/`** of the default SVGs (`vercel.svg`, `next.svg`, etc.). Leave the folder; Next.js expects it.
- **Delete the auto-generated `apps/web/.gitignore`** and `apps/web/README.md`. The root `.gitignore` covers everything; the README goes at the root too.

### Add `next-sanity`

You'll need this to query Sanity from server components:

```bash
cd ../..             # back to root
npm install next-sanity -w apps/web
```

Already in `apps/web/package.json`:

```json
{
  "dependencies": {
    "next": "16.2.6",
    "next-sanity": "^13",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:web": "next build"
  }
}
```

The `build:web` alias matters: Vercel runs the build from `apps/web/` (because its Root Directory is set to `apps/web`), so the script must resolve from there. Keeping it in both root and `apps/web` `package.json` makes the command work either way.

### Allow Sanity images through next/image

Edit `apps/web/next.config.mjs` so `<Image>` can load from Sanity's CDN:

```js
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
}
export default nextConfig
```

### Path alias

`apps/web/jsconfig.json` enables `@/` imports:

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

That's why everything in this project imports as `@/components/Navbar`, `@/i18n/config`, etc.

## Phase 3 — Scaffold `apps/studio` (Sanity)

From the monorepo root:

```bash
cd apps
npx sanity@latest init --output-path studio
```

Follow the prompts. Pick **Clean project with no predefined schemas** when asked about templates. Sanity will ask for a project ID — let it create a new one or pick an existing one.

> **Same nested `.git` trap as Next.js.** Sanity's CLI runs `git init` inside `apps/studio`. Delete it:
>
> ```bash
> cd studio
> rm -rf .git
> ```

Sometimes the CLI puts files inside `apps/studio/<project-name>/` instead of directly in `apps/studio/`. If that happens, move everything up one level and delete the empty subfolder before continuing.

The studio `package.json` keeps `react`, `react-dom`, `sanity`, `@sanity/vision`, `styled-components` as dependencies plus TypeScript for dev. The `sanity.config.ts` and `sanity.cli.ts` files need your real project ID — replace the `YOUR_PROJECT_ID` placeholders the scaffolder leaves.

### Schemas

Create `apps/studio/schemaTypes/blogPost.ts` and `apps/studio/schemaTypes/faqItem.ts`. The shape:

**FAQ item** — three fields: `question` (string, required), `answer` (text, required, ~4 rows), `order` (number — controls sort order in the UI).

**Blog post** — title (string), slug (auto-generated from title), category (string), excerpt (text), `publishedAt` (datetime), `coverImage` (image with `hotspot: true`), `body` (array of blocks for portable text).

Register both in `apps/studio/schemaTypes/index.ts`:

```ts
import { blogPost } from './blogPost'
import { faqItem } from './faqItem'
export const schemaTypes = [blogPost, faqItem]
```

## Phase 4 — Install and connect

From the **root** (not from inside either app):

```bash
npm install
```

This installs everything for both workspaces, hoists shared packages to root `node_modules/`. Never run `npm install` inside `apps/web` or `apps/studio` — always run from root.

### Wire the Next.js app to Sanity

Create `apps/web/src/sanity/lib/client.js`. The trick here is making it **build-safe**: Vercel may run a build before you've added env vars, and `createClient` will throw if `projectId` is missing. Return a no-op fetch stub instead:

```js
import { createClient } from 'next-sanity'

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : { fetch: async () => [] }
```

Create `apps/web/.env.example` so contributors know what's needed:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=your_read_token_here
```

Then `cp apps/web/.env.example apps/web/.env.local` and fill in real values. The `.local` file is gitignored.

`SANITY_API_READ_TOKEN` is only needed if you want to read **draft** documents (e.g. for live previews). For published content via `useCdn: true`, leave it blank.

## Phase 5 — The color system

One of the design decisions worth knowing about up front: the entire app's color palette is driven by **three CSS variables** in `apps/web/src/app/globals.css`.

```css
@import "tailwindcss";

@theme {
  --color-primary:   #10b981;   /* accents: buttons, badges, links, highlights */
  --color-secondary: #0f172a;   /* dark base: hero, footer, dark sections */
  --color-tertiary:  #1e293b;   /* elevated surfaces inside dark sections */
}
```

Because they're declared inside `@theme`, Tailwind v4 promotes them to utility classes automatically: `bg-primary`, `text-secondary`, `border-tertiary`, `hover:bg-primary/90`, etc.

Want a different palette? Change those three values. The entire site retunes — buttons, hero, footer, accents — without touching any component file.

> **Tailwind v4 gotcha.** Don't write `@tailwind base; @tailwind components; @tailwind utilities;` — that's the v3 syntax and will fail in v4. The single `@import "tailwindcss"` replaces all of it.

## Phase 6 — Pages and components

The structure under `apps/web/src/`:

```
src/
├── app/
│   ├── globals.css
│   └── [locale]/                 ← see Phase 7 for why
│       ├── layout.js             ← root layout: <html>, <body>, Navbar/Footer
│       ├── page.js               ← landing page (imports all sections)
│       └── blog/
│           ├── page.js           ← blog listing
│           └── [slug]/page.js    ← blog post detail
├── components/
│   ├── Navbar.js                 ← sticky, dark, mobile hamburger
│   ├── Footer.js                 ← 4 link columns + brand + social icons
│   ├── Hero.js                   ← full-screen
│   ├── Section1.js               ← white, two-column
│   ├── Section2.js               ← dark, 6 benefit cards
│   ├── Section3.js               ← light, 3 use-case cards
│   ├── Testimonials.js           ← 6 hardcoded reviews + star ratings
│   ├── FAQ.js                    ← server component, fetches from Sanity
│   └── FAQAccordion.js           ← client component, one-open accordion
└── sanity/lib/client.js
```

### Section layout pattern

Every section except Hero uses the same shell:

```jsx
<section id="..." className="bg-[color] min-h-[85vh] flex items-center py-16">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* content */}
  </div>
</section>
```

`min-h-[85vh]` keeps every section roughly the same visual weight (~85% of viewport). `flex items-center` vertically centers shorter content. `py-16` adds breathing room when content overflows.

Hero is the exception — `min-h-screen` for full viewport height.

The `id` on each section matters: the navbar's anchor links (`/#section1`, `/#section2`, `/#section3`) target them. Use plain `<a>` tags (not Next.js `<Link>`) for hash links so the browser handles cross-page scrolling natively.

### The FAQ flow (Sanity → server component → client accordion)

`FAQ.js` is a server component. It runs the GROQ query:

```js
const FAQ_QUERY = `*[_type == "faqItem"] | order(order asc) { _id, question, answer }`
const faqs = await client.fetch(FAQ_QUERY, {}, { next: { revalidate: 60 } })
```

The `revalidate: 60` tells Next.js to cache the result for 60 seconds before re-fetching. After fetching, FAQ.js renders the heading/intro and hands the `faqs` array to `<FAQAccordion faqs={faqs} />` — a `'use client'` component that owns the open/close state.

That split is the standard pattern: **fetch on the server, interact on the client**.

The same try/catch fallback used in `client.js` shows up here too — if the fetch fails (Sanity unreachable, env vars missing), `faqs = []` and the section renders empty rather than crashing.

### The blog flow

`blog/page.js` is the listing. It fetches all posts ordered by `publishedAt desc`, projects `coverImage.asset->url` into a `coverImageUrl` field for `<Image>` consumption, and renders cards.

`blog/[slug]/page.js` is the detail page. It awaits `params` (required in Next.js 15+), runs a single-document GROQ query keyed by slug, and calls `notFound()` if nothing matches. The body field is a portable-text array — the `renderBody()` helper walks it and renders `h2`/`h3`/`p` blocks into JSX.

Both blog routes are marked `export const dynamic = 'force-dynamic'`. That means they render at request time, not build time — so the build doesn't depend on Sanity being reachable. `generateStaticParams` exists but is wrapped in try/catch returning `[]` on failure.

## Phase 7 — Localization architecture

The site is locale-prefixed from day one, even though only English is active. Three reasons to build this in early:

1. URLs are part of your contract with the world. Changing `/blog/foo` to `/en/blog/foo` later means a one-time redirect mess; doing it on day one is free.
2. SEO. Search engines treat `/en/`, `/fr/`, `/de/` as distinct hreflang targets when the rest of the architecture supports it.
3. The cost is tiny — three small `i18n/` files, one proxy file, and wrapping the app router under `[locale]`. No translation library, no JSON dictionaries, no runtime overhead.

### Three files under `src/i18n/`

**`config.js`** is the single source of truth: an array of active locales (`['en']` today), a default locale, display labels, and a list of RTL locales. Adding a locale means editing this file — nothing else.

**`utils.js`** is type guards and extractors. `isValidLocale(value)` confirms a string is in the active set. `getLocaleFromPathname('/en/blog/foo')` returns `'en'`. `isRtlLocale('ar')` returns `true`. `resolveLocale(maybe)` coerces an unknown value into a usable one, falling back to default.

**`routing.js`** has the path builders. `localizedPath('en', '/blog')` returns `/en/blog`. `localizedPath('en', '/#section1')` returns `/en#section1`. `replaceLocale('/en/blog', 'fr')` returns `/fr/blog` — used by future locale-switcher UIs.

Every internal link in the app — Navbar, Footer, blog cards, "Back to Blog" — runs through `localizedPath()`. That keeps URLs canonical (no extra proxy redirect on every click).

### The proxy (Next.js 16's renamed middleware)

`apps/web/src/proxy.js` runs on the edge for every request that isn't a Next.js internal or API route. Its job is one redirect:

- If the URL already starts with an active locale (`/en/...`), do nothing.
- Otherwise, redirect to `/<DEFAULT_LOCALE><path>`. So `/` → `/en`, `/blog/foo` → `/en/blog/foo`.

```js
import { NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from './i18n/config'

export function proxy(request) {
  const { pathname } = request.nextUrl
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocalePrefix) return

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

> **Why "proxy" not "middleware".** Next.js 16 deprecated the `middleware` file convention and renamed it to `proxy`. The exported function is now named `proxy` (or default-exported). Same Edge runtime, same matcher syntax, same `NextResponse` API. If you keep using `middleware.js`, the build prints a deprecation warning.

### The `[locale]` layout

Because every page lives under `[locale]`, the layout at `app/[locale]/layout.js` becomes the root layout — it's the one that owns `<html>` and `<body>`. There is no `app/layout.js`.

It reads `locale` from awaited `params`, sets `<html lang>` and `dir` (left-to-right or right-to-left), and passes `locale` down to Navbar and Footer. It also calls `notFound()` if the param doesn't pass `isValidLocale` — a defensive check in case the proxy is somehow bypassed.

`generateStaticParams` returns `LOCALES.map(locale => ({ locale }))`, telling Next.js to prerender each active locale at build time.

> **The `suppressHydrationWarning` attribute on `<body>` is intentional.** Browser extensions like Grammarly and Dark Reader inject attributes on `<body>` after the page loads, which would otherwise trigger a hydration mismatch warning in the console. Suppressing it on `<body>` only targets that one mismatch — everything else still warns normally.

### Adding a new locale later

Three lines of work:

1. Add the code to `LOCALES` in `config.js`: `['en', 'fr']`
2. Optionally add a `LOCALE_LABELS` entry (already there for `fr`/`de`/`ar` as reference)
3. If RTL, add to `RTL_LOCALES`

Routes like `/fr/blog/my-post` start working immediately. Then you pick a translation strategy:

- **Static UI strings** — drop JSON files in `src/i18n/messages/{en,fr}.json`, write a tiny `getMessages(locale)` helper, pass them down via props or context
- **CMS content** — add a `language` field to Sanity schemas, filter GROQ queries by `language == $locale`, manage one document per translation

The routing scaffold doesn't lock you to any specific i18n library.

## Phase 8 — Deployment

### Web → Vercel

1. Push the repo to GitHub.
2. On [vercel.com](https://vercel.com), click "Import Project" and pick the repo.
3. **Set Root Directory to `apps/web`.** This is the most important setting — Vercel will detect Next.js automatically once it's pointed at the right directory.
4. Under Environment Variables, add the three `NEXT_PUBLIC_SANITY_*` values from your `.env.example` to all three environments (Production, Preview, Development).
5. Deploy.

The first deploy might surface two issues that have known fixes baked into this project:

| Issue | Why it happens | Fix already in repo |
|---|---|---|
| `Missing script "build:web"` | Vercel runs the command from `apps/web/`, where `build:web` doesn't exist by default | An alias `"build:web": "next build"` is in `apps/web/package.json` |
| `Cannot find module '../lightningcss.linux-x64-gnu.node'` | Lockfile generated on Windows doesn't include Linux native binaries | Linux binaries are pinned as `optionalDependencies` in `apps/web/package.json` (`lightningcss-linux-x64-gnu`, `@tailwindcss/oxide-linux-x64-gnu`, `@next/swc-linux-x64-gnu`) |

### Studio → Sanity Hosting

```bash
cd apps/studio
npx sanity deploy
```

Pick a studio name (becomes `<name>.sanity.studio`). After it deploys, go to [sanity.io/manage](https://www.sanity.io/manage) and add your Vercel domain to **CORS Origins** under API settings — otherwise the studio can't talk to your dataset from the web.

## Reference: the routing map

The proxy redirects un-prefixed paths to the default locale. Actual route files all live under `[locale]`.

| URL | File | Type |
|---|---|---|
| `/` | (proxy → `/en`) | redirect |
| `/blog` | (proxy → `/en/blog`) | redirect |
| `/en` | `app/[locale]/page.js` | prerendered (SSG) |
| `/en/blog` | `app/[locale]/blog/page.js` | dynamic |
| `/en/blog/<slug>` | `app/[locale]/blog/[slug]/page.js` | dynamic |

## Reference: env vars

| Variable | Where | Required for |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `.env.local` + Vercel | Sanity queries (FAQ, blog) |
| `NEXT_PUBLIC_SANITY_DATASET` | `.env.local` + Vercel | Same — usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `.env.local` + Vercel | Same — an ISO date pinning the API shape |
| `SANITY_API_READ_TOKEN` | `.env.local` only | Optional. Only for draft previews. |

## Reference: gotchas

| Gotcha | Fix |
|---|---|
| `params.locale` / `params.slug` is undefined | Next.js 15+ made `params` async. `const { locale, slug } = await params`. |
| Anchor links don't scroll from a different page | Use plain `<a>`, not `<Link>`, for hash hrefs. Build them with `localizedPath(locale, '/#sectionId')`. |
| Sanity images not loading | `cdn.sanity.io` must be in `next.config.mjs` `remotePatterns`. |
| `apps/web` missing from `git push` | Nested `.git` inside `apps/web` (or `apps/studio`) — parent treats the app as a submodule. Delete the nested `.git` and re-stage. |
| FAQ/blog renders empty | Documents must be **published** in Sanity, not just drafted. |
| Hydration error mentioning `data-new-gr-c-s-check-loaded` | Browser extension. `suppressHydrationWarning` on `<body>` already handles this. |
| Build warns `The "middleware" file convention is deprecated` | Use `src/proxy.js` and a `proxy` (or default) export. Next.js 16's rename. |
| `npm install` shows deprecation warnings for `uuid@8`, `uuid@10`, `whatwg-encoding@3`, plus a `mute-stream@4` engine warning | All transitive deps of `apps/studio`'s Sanity CLI. Cosmetic; do not blindly override (uuid 8/10→11 has API differences). They'll resolve when Sanity publishes updates upstream. |

## Reference: command cheatsheet

All commands from the **repo root**.

| Command | What it does |
|---|---|
| `npm install` | Install everything for both workspaces |
| `npm run dev` | Run web (`:3000`) and studio (`:3333`) in parallel |
| `npm run dev:web` | Run just Next.js |
| `npm run dev:studio` | Run just Sanity Studio |
| `npm run build:web` | Vercel's build command — `next build` against the web workspace |
| `npx sanity deploy` | (from `apps/studio`) Deploy Studio to Sanity hosting |

---

## A note on this guide vs. the blueprint

This document is the human onboarding read. It explains the shape and the choices.

[`AGENT_BLUEPRINT.md`](AGENT_BLUEPRINT.md) is the agent-facing spec — full file contents, verbatim, line by line, with every component dumped out. When an LLM agent needs to reproduce the project one-to-one, the blueprint is what it consumes.

Both stay in sync. If you change architecture in this guide, update the blueprint too (and vice versa).
