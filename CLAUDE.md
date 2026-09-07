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

No CSS framework. Hand-written CSS, split into ten files under **`app/styles/`**, all imported by `app/layout.tsx` **in a load-bearing order**:

`tokens.css` → `base.css` → `layout.css` → `components.css` → `page-home.css` → `page-appointments.css` → `page-prescriptions.css` → `page-closures.css` → `page-contact.css` → `page-legal.css`

- `tokens.css` — only `:root` custom properties: sage-green colour ramp + semantic aliases, `clamp()` type scale, spacing, radii, shadows, `--container`.
- `base.css` / `layout.css` / `components.css` — element defaults; container, header, nav, footer, section rhythm; reusable buttons, cards, callouts, tables, `.visually-hidden`.
- `page-*.css` — page-specific rules only, class-prefixed per page (`.home-…`, `.contact-…`, `.news-…`).

Prefer an existing shared class over inventing a new one. Put page-specific rules in that page's file, never in `components.css`.

### The logo is not part of the palette

`components/practice-logo.tsx` is the practice's own mark — a stethoscope whose ear tubes frame a heart and whose tubing loops into a bow on the right. **Don't redraw, simplify or recolour it.**

It is a **trace of the practice's original artwork**, not a rendition of it. The August 2026 redesign shipped a hand-drawn approximation; the doctor's verdict was that it "doesn't look like the real logo yet", so in August 2026 the original file was separated by colour, vectorised (potrace), and checked back against the source — 0.3 % of pixels differ, all of it edge antialiasing. Anything that makes the mark *look different from the practice's file* is a regression, however tidy the code gets. If you ever need the source again: the practice sent it by WhatsApp, 1567 × 1243 px.

Three consequences worth knowing before you touch it:

- **Filled shapes, no strokes.** There is no `stroke`/`stroke-width` and no `currentColor` anywhere in the mark any more. It therefore scales cleanly from favicon to hero, and `vector-effect: non-scaling-stroke` has nothing to act on.
- **Three colours, drawn in a load-bearing order** — `--logo-tube` grey `#959699` (upper ear tubes), then `--logo-ink` charcoal `#423e3d` (ear olives + the whole lower tube), then `--logo-heart` red `#a7203e` (heart + chest piece). Lower layers sit a hair wider under the upper ones so no light seam flashes at the colour joins. Don't reorder them.
- The tokens are deliberately *not* derived from `--brand`, so a palette change can't drag the mark along. Note `--logo-heart` `#a7203e` and the site's bordeaux `--wine-500` `#a74d5f` are **near-neighbours but not the same colour** — that is intentional (the full logo red is too loud as a page-wide surface/text colour). Don't "fix" the discrepancy by unifying them.

The same paths and the same colours — hard-coded there, since a standalone file has no CSS variables — are the favicon in `app/icon.svg`. **Change one, change both.**

Two practical traps: the viewBox is **80×64 (5:4), not square** — always derive the width from the height or it squashes; and on the dark footer the mark sits on a light plate (`--logo-plate`) rather than being inverted, so it looks identical everywhere. The artwork now fills that viewBox — flush against the left and right edges, with 0.27 units of air top and bottom (height 63.47 of 64, vertically centred). There is no meaningful invisible margin left to compensate for and no `tight` prop any more; the 5:4 box is kept exactly so `calc(height * 1.25)` in `layout.css` stays correct.

## Text strings (German-only)

The site is **German-only**. There is no multi-locale routing, no `[locale]` route tree, and no `next-intl` middleware/provider. `lib/i18n.ts` defines a single locale (`de`) and exposes `getTranslator()`, a thin wrapper over `next-intl`'s `createTranslator` that reads `messages/de.json` synchronously. Components call `t('namespace.key')` with no locale argument.

`lib/routing.ts` is the single source of truth for URLs: `routeByKey` maps a `RouteKey` to its German path (`/termine`, `/schliesszeiten`, `/kontakt`, …), and `getPath(routeKey)` returns it. Note that `closures` still lives at **`/schliesszeiten`** although the page is called *Urlaubszeiten* everywhere since September 2026 — renaming the path would dead-link whatever the practice has already handed out. Path and label are allowed to disagree; don't "fix" it without asking. **Always build internal links with `getPath` and Next's `<Link>`** — never hardcode paths, or the production `basePath` gets lost.

## Information architecture — the one rule that matters

The practice's core complaint about the previous version was duplicated information. Every fact now has **exactly one canonical home**; other pages link to it instead of repeating it:

| Information | Canonical home |
|---|---|
| How to get an appointment (both routes + time windows), video consultation | `/termine` |
| Prescriptions and referrals: app first, then Rezepttelefon, 24/7 availability, processing times, eGK precondition | `/rezepte` |
| Vacation periods + substitutes | `/schliesszeiten` (other pages show only the compact `NextVacationBanner`) |
| 116 117 / 112 | `/schliesszeiten` and the end of `/`, both `full`; `/kontakt` carries the `compact` variant — one component, so the numbers can't drift |
| Phone, prescription phone, fax, address, directions | `/kontakt` (main number also in header/footer, address also in footer) |
| What the practice is, opening hours | `/` |
| **"only with an appointment" rule, mask notice** | `/` **and** the end of `/termine` — the one deliberate exception, see below |

**The home page is deliberately thin, in this order:** hero (practice name + the *Anrufen* button + the practice's own logo — no eyebrow, no specialty line, no lead, **no booking button**), `Die Praxis`, `Sprechzeiten`, the two visit rules, the 116 117 / 112 block. Nothing else. Don't grow it back.

The practice moved the two visit rules **up** (August 2026) — they used to close the page — but explicitly **not all the way up**: "directly after the opening hours", so someone who just checked when the practice is open reads next what applies when they come. An earlier revision put them ahead of `Sprechzeiten`; the practice corrected that. In September 2026 the signpost paragraph that followed them was deleted and the emergency block asked for in its place ("unter bei Erkältungssymptomen") — that tinted band now closes the page against the dark footer, which is why `.home-rules` and its extra bottom padding are gone again.

### The September 2026 shortening pass — don't undo it

The practice went through the live site with a highlighter (screenshots, 07.09.2026) and struck what it read as filler: *"kurz und klar, weniger Text, dann kommt mehr an."* Everything below was removed **on request** and must not be "restored" as an improvement:

| Gone | Where it was |
|---|---|
| Signpost paragraph "Termine, Rezepte und Hausbesuche sind unter …" | end of `/` (`home.guide`) |
| "Während der Schließzeiten der Praxis gelten abweichende Zeiten." | above the closures link on `/` (the link stayed) |
| Body text of the appointment-only callout | `/` and `/termine` — the heading now carries the rule alone |
| "Zum Schutz unserer Patientinnen und Patienten …" preamble + "Vielen Dank für Ihr Verständnis …" | mask note, shortened to the rule itself |
| Section "Sprechzeiten außerhalb der Urlaubszeiten" | end of `/schliesszeiten` (`closures.hours`, `.news-hours`) |
| Eyebrow + section heading "Termin vereinbaren" | `/termine` — both repeated the `<h1>` |
| Paragraph "Patientinnen und Patienten, die unsere Praxis-App noch nicht nutzen …" | `/termine`; survives as three words in the phone card (`appointments.phoneNoApp`) |
| "Für geeignete Anliegen" | opening of `appointments.videoLine` |
| Eyebrow, lead and heading "So fordern Sie an" | `/rezepte` — three restatements of the `<h1>` above each other |

Eyebrows on `/kontakt` and `/schliesszeiten` were **kept**: the practice only reviewed `/termine` and `/rezepte`, so only those two lost theirs. If it ever asks for consistency, they go too.

### … and the second round, same evening

Reviewing the result the practice asked for these, all implemented:

- **`/hausbesuche` deleted** — the third page to go after `/leistungen`. House calls are now mentioned nowhere on the site; `practice.houseCallsNote` and `houseCallsArrangement` stay as unrendered leaflet wording. Nav is down to five items (the header stays two-row, see below).
- **"Schließzeiten" → "Urlaubszeiten"** in every visible string — nav, `<h1>`, table captions, overview headings, the link on `/`, the browser title (which still said the long-dead "Aktuelles"). The **path stays `/schliesszeiten`**.
- **116 117 / 112 added to the end of `/`** (see the IA table).
- The appointment-only heading is now a full sentence: *"Bitte nur mit vereinbartem Termin in die Praxis kommen"*.
- The mask box moved its examples **into the heading**: *"Bei Erkältungssymptomen (z. B. Husten, Schnupfen oder Halsschmerzen)"*, leaving `practice.maskNote` as the bare rule.
- On `/rezepte` the words *"Arzt-Direkt Praxis-App"* are a **bold external link** to `practice.bookingUrl`, and the "Bitte beachten Sie" note moved **below** the Rezepttelefon panel (it is a precondition for both routes, so it belongs after both).

**The hero shows `PracticeLogo`, not an illustration.** The practice asked for its own mark — the stethoscope looping around a heart, the one on its business card and on the newly filmed window — instead of the previous drawing of a window with a plant. `PracticeIllustration` in `components/illustrations.tsx` is therefore currently unused but kept. The logo sits on a soft `--brand-soft` field (`.home-hero__plate`), because it is a free-standing mark with no surface of its own and looked lost in the column. It is sized off its **width** (`.home-hero__logo`, 76 % of the plate) — the mark is landscape and fills its viewBox, so width is the long side. Do **not** put the shared `.illustration` class on it: it carries sizing and framing rules that don't fit here.

### The two visit rules live in one component and render twice

`components/visit-rules.tsx` renders the pair (appointment-only callout + mask note) and **nothing else** — no `<Section>`, so each page picks tone, position and heading itself: the home page hides the heading, `/termine` shows it (`appointments.rulesTitle`). It is rendered on `/` and at the end of `/termine`.

Both boxes are down to their core since September 2026: the sand callout is **a heading with no body**, the mask note a heading plus one sentence. The long leaflet sentences are still in `content/practice.ts` (`appointments.byAppointmentOnly`, and `appOptOut` for the same reason) — kept as the practice's own wording, deliberately unrendered, each marked as such in a comment. Same pattern as `practice.services`.

Yes, that is a deliberate exception to the one-canonical-home rule above, made by the practice in August 2026: many people land on `/termine` to book and should see both rules there too. The exception is narrow and safe because **the sentences themselves still exist exactly once** (`practice.appointments.byAppointmentOnly`, `practice.maskNote`, `home.rules.*`) — what repeats is the presentation, not the content, and it cannot drift. Don't extend it to a third page without asking, and don't inline-copy the JSX.

**The Online-Termin button lives in the header only.** The practice removed it from the hero but explicitly kept it top right. Online booking itself stays fully intact (`/termine` still explains it).

**There is no `/leistungen` page.** The practice had it removed in August 2026 after it had carried a single sentence for months. `practice.services` remains in `content/practice.ts` as data but nothing renders it, and `CareIllustration` was deleted with the page. Don't recreate it without asking.

### The header has two rows above 62em — don't "fix" it

Showing every nav item — nothing hidden in a menu — is an explicit wish of the practice. With the six items it had until September 2026 they did not fit one row: measured against the container's 1008px content box, brand + nav + phone + button + gaps exceed it by a wide margin, and `--container` caps at 1088px so a wider viewport never helps. Deleting `/hausbesuche` brought it down to five, but the two-row header stayed — it is the stable form, and the next added item would otherwise force the layout back again.

So above 62em the header is `"brand cta" / "nav nav"` — brand and actions on top, navigation full-width below with a hairline divider. Header height ≈ 122px. Below 62em nothing changed: the CSS-only `<details>` menu holds the navigation.

If you add a seventh item, re-measure before assuming it fits.

### Adding or changing a page/route

A single route exists in several places that must stay in sync:
1. `lib/routing.ts` — add the `RouteKey` and its path to `routeByKey`.
2. `app/<path>/page.tsx` — the route file (`metadata`/`generateMetadata` + render the shared component).
3. `components/pages/<name>-page.tsx` — the actual page, wrapped in `<PageShell routeKey>`.
4. `messages/de.json` — add the needed keys (translations are read synchronously; a missing key throws at build/render).

`app/sitemap.ts` and `lib/seo.ts` derive everything from `routeByKey`, so they update automatically once routing is correct.

## Content vs. text strings

- **`content/practice.ts`** — factual practice data (address, phone numbers, fax, opening hours, booking URL, map URL) plus the practice's own prose from its leaflets (`appointments`, `prescriptionNotes`, `maskNote`, `houseCallsNote`). These are real verified details; treat changes here as sensitive — don't invent or alter phone numbers/addresses, and keep leaflet wording verbatim.
  A sentence may carry placeholders — **`{phone}`** for a number, **`{app}`** for the arzt-direkt link (see `prescriptionNotes.orderLine`). Render it with `<LinkedSentence>` (`components/linked-sentence.tsx`), which splits on the placeholders and inserts each as a link — so every number and URL still exists exactly once in the repo. Don't paste a number or URL into the prose. (This was `PhoneSentence` until September 2026, when `/rezepte` needed a second link in the same sentence.)
  **The criterion for calling instead of booking online is APP USAGE, not "new patient".** The practice explicitly corrected the earlier wording ("Neue Patientinnen und Patienten melden sich bitte telefonisch"): long-standing patients who don't use the app also belong on the phone. See `appointments.appOptOut`.
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

1. **`components/next-vacation-banner.tsx`** (`NextVacationBanner`, no props) — a compact sand-coloured bar naming only the *next or currently running* vacation, linking to `/schliesszeiten`. Rendered on `/`, `/termine`, `/rezepte` and `/kontakt`. Returns `null` when nothing is upcoming.
2. **`components/vacation-overview.tsx`** — the full display on `/schliesszeiten`, in two parts:
   - a **featured block** for the next/current period (illustration, large date range, return date, and a column of substitute cards with `tel:` links);
   - an **overview section** ("Alle geplanten Urlaubszeiten") that is always present as long as at least one period exists, so the practice can always see what is stored. With **two or more** periods it holds the full table (all periods, including the running one — there the repetition is wanted: the table is the year plan, the block above is the acute notice). With **exactly one** it holds a sentence saying no further closures are planned — a one-row table would repeat the featured block verbatim, which is the duplication the practice complained about.
   Below ~60em the table becomes labelled cards (explicit ARIA `role` attributes, because the `display` overrides strip table semantics).
3. **`components/emergency-service.tsx`** (`EmergencyService`, `variant?: 'full' | 'compact'`) — the 116 117 / 112 block. `full` on `/schliesszeiten` and at the end of `/`, `compact` on `/kontakt`. It is a **general** out-of-hours notice and must stay spatially separate from the vacation notice: KV rules forbid naming the on-call service as the practice's holiday substitute.

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
