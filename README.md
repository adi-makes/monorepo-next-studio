# Monorepo

A monorepo containing the Next.js frontend and Sanity Studio.

## Structure

```
apps/
├── web/      # Next.js frontend
└── studio/   # Sanity Studio (content management)
```

## Getting Started

Install all dependencies from the root:

```bash
npm install
```

### Run apps individually

```bash
# Next.js — http://localhost:3000
npm run dev:web

# Sanity Studio — http://localhost:3333
npm run dev:studio
```

## Environment Variables

Copy `.env.example` to `.env.local` inside `apps/web` and fill in the values:

```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (e.g. `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version (ISO date) |
| `SANITY_API_READ_TOKEN` | Sanity read token — generate at [sanity.io/manage](https://www.sanity.io/manage) |
