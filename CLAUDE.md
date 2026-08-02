# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing/info website for a German medical practice ("Praxis Veronika Chernova", a GP/internal-medicine practice in Bielefeld). Next.js 16 App Router + React 19, TypeScript (strict), exported to fully static HTML and deployed to GitHub Pages. There is no backend, database, or client-side data fetching — all content is baked in at build time.

**Everything stays a React Server Component.** There is no `'use client'` anywhere and no browser JavaScript of our own; interactivity (the mobile menu) is CSS-only via `<details>/<summary>`. Keep it that way.

**No external requests, ever.** No webfonts (system font stack only), no CDN, no analytics, no remote images. This is a German medical practice — third-party requests are a GDPR problem. The only external URLs in the markup are click-through links (arzt-direkt booking, Google Maps) plus non-fetching namespace URLs (`schema.org` in JSON-LD, `w3.org` in SVG).

## Commands

```bash
npm run dev        # local dev server (http://localhost:3000)
npm run build      # static export -> ./out  (this is also the deploy build)
npm run typecheck  # tsc --noEmit
npm test           # vacation-logic unit tests (custom harness, prints "N PASS, N FAIL")
npm start          # serve a production build (rarely needed; site is static)
```

There is **no linter/formatter**. Run `npm run typecheck`, `npm test` and `npm run build` before considering work done — a missing `messages/de.json` key only fails at build time, not at typecheck.

## Styling

No CSS framework. Hand-written CSS, split into nine files under **`app/styles/`**, all imported by `app/layout.tsx` **in a load-bearing order**:

`tokens.css` → `base.css` → `layout.css` → `components.css` → `page-home.css` → `page-services.css` → `page-news.css` → `page-contact.css` → `page-legal.css`

- `tokens.css` — only `:root` custom properties: sage-green colour ramp + semantic aliases, `clamp()` type scale, spacing, radii, shadows, `--container`.
- `base.css` / `layout.css` / `components.css` — element defaults; container, header, nav, footer, section rhythm; reusable buttons, cards, callouts, tables, `.visually-hidden`.
- `page-*.css` — page-specific rules only, class-prefixed per page (`.home-…`, `.contact-…`, `.news-…`).

Prefer an existing shared class over inventing a new one. Put page-specific rules in that page's file, never in `components.css`.

### The logo is not part of the palette

`components/practice-logo.tsx` is the practice's existing mark — a stethoscope looping around a heart. It survived the 2026-08 redesign unchanged, by explicit instruction. **Don't redraw, simplify or recolour it.** Its colours live in dedicated tokens (`--logo-ink` navy `#183753`, `--logo-heart` rose `#a74d5f`) that are deliberately *not* derived from `--brand`, so a future palette change can't drag the mark along. The same paths and hard-coded colours are the favicon in `app/icon.svg` — change one, change both.

Two practical traps: the viewBox is **80×64 (5:4), not square** — always derive the width from the height or it squashes; and on the dark footer the mark sits on a light plate (`--logo-plate`) rather than being inverted, so it looks identical everywhere.

## Text strings (German-only)

The site is **German-only**. There is no multi-locale routing, no `[locale]` route tree, and no `next-intl` middleware/provider. `lib/i18n.ts` defines a single locale (`de`) and exposes `getTranslator()`, a thin wrapper over `next-intl`'s `createTranslator` that reads `messages/de.json` synchronously. Components call `t('namespace.key')` with no locale argument.

`lib/routing.ts` is the single source of truth for URLs: `routeByKey` maps a `RouteKey` to its German path (`/leistungen`, `/aktuelles`, `/kontakt`, …), and `getPath(routeKey)` returns it. **Always build internal links with `getPath` and Next's `<Link>`** — never hardcode paths, or the production `basePath` gets lost.

## Information architecture — the one rule that matters

The practice's core complaint about the previous version was duplicated information. Every fact now has **exactly one canonical home**; other pages link to it instead of repeating it:

| Information | Canonical home |
|---|---|
| Phone, prescription phone, fax, address block, directions | `/kontakt` (main number also in header/footer, address also in footer) |
| Opening-hours table | `/kontakt` (also on `/` as the single shared `OpeningHours` component — one source, no duplicated prose) |
| **How to get an appointment** (both routes + time windows), the "only with an appointment" rule and the mask notice | `/` section `#termin` — see below |
| Prescriptions, house-call rules | `/kontakt` |
| All vacation periods + substitutes, 116 117 / 112 | `/aktuelles` (`/` and `/kontakt` show only the compact `NextVacationBanner`) |
| Services | `/leistungen` — see the caveat below |

Before adding a block of prose or contact detail to a page, check whether it already lives somewhere else. If it does, link instead.

**Appointments live on the home page, not on `/kontakt`.** The section `#termin` ("Termin vereinbaren") is the canonical answer to the most common question a GP practice gets, so it sits where everyone lands. It holds both routes with their time windows (online from 00:00, phone 07:30–08:30, always for the *current day*), the binding "treatment only by prior appointment" rule and the mask notice for cold symptoms. `/kontakt` states the binding rule once — someone on the contact page must not have to leave to learn it — and links to `#termin` for the how. All wording comes from the practice's own leaflet and lives in `content/practice.ts` (`appointments`, `maskNote`), so the two pages cannot drift apart.

**`/leistungen` carries one sentence and nothing else** — "Wir bieten das gesamte Spektrum der hausärztlichen Leistungen an." This is a deliberate, repeated decision by the practice (commit 9d7bed2 "Leistungsseite: nur die Aussage, keine Unterpunkte", reaffirmed after the 2026-08 redesign, which had expanded it into a services list plus DMP explanations). `practice.services` stays in `content/practice.ts` as data but is **not rendered**. Don't break it out into a list, don't explain the DMP programmes, and keep the page's meta description free of claims the page doesn't make. Ask the practice before adding anything here.

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
- **`content/legal.ts`** — the full Impressum and Datenschutzerklärung text, structured as `LegalSection[]` (`{heading, body: string[]}`) in two exports (`impressum`, `datenschutz`). `components/pages/legal-page.tsx` selects the array by `routeKey` (`legal` → Impressum, `privacy` → Datenschutz) and renders the sections with an anchor-link table of contents; `messages/de.json` only holds the hero `eyebrow`/`title` for these pages. This is legal text — **never reword, shorten or "improve" it**; only its presentation is ours. (The `[BITTE ERGÄNZEN: …]` placeholders described in older notes were filled in and no longer exist; should new ones appear, keep them visible.)

## Vacation / substitute notices (CMS-managed)

Holiday/closure periods and any substitute-practice details live in **`content/vacation.json`** (shape: `{ "periods": [ … ] }`). The non-technical practice team edits this file through **Pages CMS**; the editing form is defined by **`.pages.yml`** in the repo root (German labels + help texts). `content/practice.ts` reads the JSON **tolerantly** (via `node:fs`) and exposes it as `getVacationPeriods()` — an empty, missing, or invalid file resolves to an empty list, so a CMS deletion can never break the build (Pages CMS writes an empty file when the last entry is removed).

### One vacation, several substitute practices

The CMS form originally allowed only **one** substitute per period (`substitute`, singular). When the practice needed three, they entered the same vacation three times — one per substitute — and the site showed three vacations. Two things now guard against this:

- `.pages.yml` uses `substitutes` with `list: true`, so several can be entered under one period. Both lists are `collapsible` with a `summary` template (`"{start} bis {end}"`, `"{name}"`) so the nested form stays readable. Pages CMS's `ListSchema` accepts the object form of `list` but **requires `collapsible` inside it** and is `.strict()` — don't add other keys, and don't break this file: a config Pages CMS rejects locks the practice out of editing.
- `mergePeriodsByRange` in `lib/vacation-logic.ts` folds periods sharing the same `start` **and** `end` into one, concatenating their substitutes (deduplicated by name + phone, case/whitespace insensitive) and joining distinct notes. It is applied in `lib/vacations.ts` via `displayPeriods()`, so every view benefits.

The merge is what makes already-entered data correct without anyone re-typing it, and it also covers the legacy singular `substitute` key (normalised in `content/practice.ts`). Keep it even after the new form has been in use for a while.

**Call `getVacationPeriods()`, never cache the result at module scope.** In development it re-reads the file on every call; in a production build it reads once and caches. This matters: `vacation.json` is read with `readFileSync`, not imported, so Turbopack has no idea it changed. It used to be a module-level `const`, which meant `npm run dev` kept serving whatever the file said when the server started — after a CMS edit the site looked like vacations or substitutes were missing, and only a restart fixed it.

The display has **three parts**:

1. **`components/next-vacation-banner.tsx`** (`NextVacationBanner`, no props) — a compact sand-coloured bar naming only the *next or currently running* vacation, linking to `/aktuelles`. Rendered on `/`, `/leistungen` and `/kontakt`. Returns `null` when nothing is upcoming.
2. **`components/vacation-overview.tsx`** — the full display on `/aktuelles`, in two parts:
   - a **featured block** for the next/current period (illustration, large date range, return date, and a column of substitute cards with `tel:` links);
   - a **"Schließzeiten" section** that is always present as long as at least one period exists, so the practice can always see what is stored. With **two or more** periods it holds the full table (all periods, including the running one — there the repetition is wanted: the table is the year plan, the block above is the acute notice). With **exactly one** it holds a sentence saying no further closures are planned — a one-row table would repeat the featured block verbatim, which is the duplication the practice complained about.
   Below ~60em the table becomes labelled cards (explicit ARIA `role` attributes, because the `display` overrides strip table semantics).
3. **`components/emergency-service.tsx`** (`EmergencyService`, `variant?: 'full' | 'compact'`) — the 116 117 / 112 block. `full` on `/aktuelles`, `compact` on `/kontakt`.

All pure, node-testable logic lives in **`lib/vacation-logic.ts`** (type-only import of `VacationPeriod`, no real data, no React): `parseIsoDate`, `isOngoing`, `getUpcomingVacations`, `getImminentVacation`, `getNextOrCurrentVacation`, `getReturnDate`, `formatWeekday`, `formatDate`, `formatReturnDate`, `formatCompactRange`, `formatVacationRange`, `telHref`, `vacationListYear`, `getVacationYears`.

`lib/vacations.ts` binds the real `vacationPeriods` and exposes `…Now` wrappers. Note `getReturnDate(period, openWeekdays)`: the return date **skips days the practice is closed** — derived from `practice.openingHours` — so a vacation ending Friday says "Ab Montag", not "Ab Samstag". `today` = local midnight of build time.

Tests live in `lib/vacation-logic.test.ts` (`npm test`, 122 assertions) and cover year-boundary periods, "ends today", "starts tomorrow", past periods, multiple substitutes and the empty list. **Extend them when you touch the logic.** Editors enter phone numbers as plain text — there is no `phoneHref` field.

When changing any of this, verify all data shapes by temporarily editing `content/vacation.json`, running `npm run build`, and **restoring the file byte-identically** (check with `git diff`) — the practice team owns that file.

## SEO & metadata

`lib/seo.ts` `buildMetadata({routeKey, title, description})` produces a canonical URL plus OpenGraph (locale `de_DE`)/Twitter tags. There are **no** `hreflang`/`x-default` alternates — the site is German-only. Each route's `metadata` should call it. `StructuredData` (`components/structured-data.tsx`) injects JSON-LD. Site base URL comes from `NEXT_PUBLIC_SITE_URL`.

`getSiteUrl` normalises the base to end in `/` and resolves paths **relatively**. This is load-bearing: on GitHub Pages the site lives in a subdirectory, and `new URL('/leistungen', 'https://…/Praxis-Chernova')` resolves against the *origin* and silently drops it — which previously produced canonical URLs, `og:url`, JSON-LD ids, `sitemap.xml` and `robots.txt` all pointing at addresses that don't exist. Don't "simplify" it back.

To verify a production build: `GITHUB_ACTIONS=true NEXT_PUBLIC_SITE_URL=https://printproof.github.io/Praxis-Chernova npm run build`, then check `out/*/index.html` for `/Praxis-Chernova`-prefixed assets and canonicals — and rebuild without those env vars afterwards so `out/` matches local state.

## Deployment (GitHub Pages)

`.github/workflows/` builds on push to `main` and deploys `./out`. `next.config.ts` sets `output: 'export'`, `trailingSlash: true`, `images.unoptimized`, and — **only when `GITHUB_ACTIONS === 'true'`** — applies `basePath`/`assetPrefix` of `/Praxis-Chernova`. So locally there is no base path, but production assets/links are served under that subpath; rely on Next's `<Link>` and `getPath` rather than manual URLs so the base path is handled for you.
