# Monorepo — Next.js + Sanity

A monorepo containing the Next.js web app and Sanity Studio for content management.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| CMS | Sanity v3 |
| Deployment | Vercel (web) · Sanity Hosting (studio) |

## Structure

```
apps/
├── web/        # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js          # Landing page
│   │   │   ├── layout.js        # Root layout (Navbar + Footer)
│   │   │   └── blog/
│   │   │       ├── page.js      # Blog listing
│   │   │       └── [slug]/      # Blog post detail
│   │   ├── components/          # UI components
│   │   └── sanity/lib/          # Sanity client
│   └── .env.example
└── studio/     # Sanity Studio
    └── schemaTypes/
        ├── blogPost.ts          # Blog post schema
        └── faqItem.ts           # FAQ schema
```

## Getting Started

Install all dependencies from the root:

```bash
npm install
```

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
# Next.js — http://localhost:3000
npm run dev:web

# Sanity Studio — http://localhost:3333
npm run dev:studio
```

## Sanity Content

Manage content at [sanity.io/manage](https://www.sanity.io/manage) or via the Studio.

| Schema | Fields |
|---|---|
| `blogPost` | title, slug, category, excerpt, coverImage, publishedAt, body |
| `faqItem` | question, answer, order |

## Deployment

### Web → Vercel
1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `apps/web`
3. Add the environment variables from `.env.example`
4. Deploy

### Studio → Sanity Hosting
```bash
cd apps/studio
npx sanity deploy
```

After deploying, add your Vercel domain to **CORS Origins** in [sanity.io/manage](https://www.sanity.io/manage).

Checking vercel