# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing/info website for a German medical practice ("Praxis Veronika Chernova", a GP/internal-medicine practice in Bielefeld). Next.js 16 App Router + React 19, TypeScript (strict), exported to fully static HTML and deployed to GitHub Pages. There is no backend, database, or client-side data fetching — all content is baked in at build time. No CSS framework: styling is hand-written in `app/globals.css`.

## Commands

```bash
npm run dev        # local dev server (http://localhost:3000)
npm run build      # static export -> ./out  (this is also the deploy build)
npm run typecheck  # tsc --noEmit — the only check; run before considering work done
npm start          # serve a production build (rarely needed; site is static)
```

There is **no test runner and no linter/formatter** configured. `npm run typecheck` is the only automated verification.

## Text strings (German-only)

The site is **German-only**. There is no multi-locale routing, no `[locale]` route tree, and no `next-intl` middleware/provider. `lib/i18n.ts` defines a single locale (`de`) and exposes `getTranslator()`, a thin wrapper over `next-intl`'s `createTranslator` that reads `messages/de.json` synchronously. Components call `t('namespace.key')` with no locale argument.

`lib/routing.ts` is the single source of truth for URLs: `routeByKey` maps a `RouteKey` to its German path (`/leistungen`, `/kontakt`, …), and `getPath(routeKey)` returns it. **Always build internal links with `getPath`** — never hardcode paths.

### Adding or changing a page/route

A single route exists in several places that must stay in sync:
1. `lib/routing.ts` — add the `RouteKey` and its path to `routeByKey`.
2. `app/<path>/page.tsx` — the route file (`metadata`/`generateMetadata` + render the shared component).
3. `components/pages/<name>-page.tsx` — the actual page, wrapped in `<PageShell routeKey>`.
4. `messages/de.json` — add the needed keys (translations are read synchronously; a missing key throws at build/render).

`app/sitemap.ts` and `lib/seo.ts` derive everything from `routeByKey`, so they update automatically once routing is correct.

## Content vs. text strings

- **`content/practice.ts`** — factual practice data (address, phone numbers, fax, opening hours, booking URL, map URL). These are real verified contact details; treat changes here as sensitive — don't invent or alter phone numbers/addresses.
- **`messages/de.json`** — all UI/prose strings, keyed by dotted namespaces (`nav.*`, `hero.*`, `home.*`, …). Access via `t('namespace.key')` from `getTranslator()`.
- **`content/legal.ts`** — the full Impressum and Datenschutzerklärung text, structured as `LegalSection[]` (`{heading, body: string[]}`) in two exports (`impressum`, `datenschutz`). `components/pages/legal-page.tsx` selects the array by `routeKey` (`legal` → Impressum, `privacy` → Datenschutz) and renders one `<Section title={heading}>` per entry with a `<p>` per body line; `messages/de.json` only holds the hero `eyebrow`/`title` for these pages. The text contains intentional `[BITTE ERGÄNZEN: …]` / `[BITTE PRÜFEN: …]` placeholders for legally open points — do not remove or invent values for them.

## Vacation / substitute notices (CMS-managed)

Holiday/closure periods and any substitute-practice details live in **`content/vacation.json`** (shape: `{ "periods": [ … ] }`). The non-technical practice team edits this file through **Pages CMS**; the editing form is defined by **`.pages.yml`** in the repo root (German labels + help texts). `content/practice.ts` reads the JSON **tolerantly at build time** (via `node:fs`) and exposes it as `vacationPeriods` — an empty, missing, or invalid file resolves to an empty list, so a CMS deletion can never break the build (Pages CMS writes an empty file when the last entry is removed). `lib/vacations.ts` filters out expired entries automatically (`getActiveVacationPeriods`), formats the date range (`formatVacationRange`), and builds the substitute `tel:` link from the plain-text phone number (`telHref`). When `periods` is empty, no notice renders (`components/practice-notice.tsx`). Editors enter the phone number as plain text only — there is no `phoneHref` field.

## SEO & metadata

`lib/seo.ts` `buildMetadata({routeKey, title, description})` produces a canonical URL plus OpenGraph (locale `de_DE`)/Twitter tags. There are **no** `hreflang`/`x-default` alternates — the site is German-only. Each route's `metadata` should call it. `StructuredData` (`components/structured-data.tsx`) injects JSON-LD. Site base URL comes from `NEXT_PUBLIC_SITE_URL`.

## Deployment (GitHub Pages)

`.github/workflows/` builds on push to `main` and deploys `./out`. `next.config.ts` sets `output: 'export'`, `trailingSlash: true`, `images.unoptimized`, and — **only when `GITHUB_ACTIONS === 'true'`** — applies `basePath`/`assetPrefix` of `/Praxis-Chernova`. So locally there is no base path, but production assets/links are served under that subpath; rely on Next's `<Link>` and `getPath` rather than manual URLs so the base path is handled for you.
