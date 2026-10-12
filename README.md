# fells.dev

Marketing site for Fells: top coding agents (Claude Code, Codex, …), better-value
plans, and an always-on cloud workspace built on the open-source
[Lody](https://github.com/LodyAI/Lody) (Apache-2.0).

```bash
pnpm install
pnpm dev       # http://localhost:4321  (/ = English; /zh/ /zh-hant/ /ja/ /ko/ /es/)
pnpm build     # astro check + static build to dist/
```

## Where things live

| What | File |
| --- | --- |
| Landing copy, 6 languages | `src/i18n/{en,zh,zh-hant,ja,ko,es}.ts` (same shape, type-checked) |
| Inner-page copy, 6 languages | `src/i18n/pages/*.ts` (`PagesDict`) |
| Inner pages | `src/components/pages/*Page.astro`, routes in `src/pages/` and `src/pages/[lang]/` |
| Marketplace channels | `channels` in `src/data/catalog.ts` |
| Plan prices, group-plan seats, pay-as-you-go table | `src/data/catalog.ts` |
| Waitlist endpoint, contact email | `src/site.ts` |
| Section order | `src/components/Landing.astro` |
| Design tokens (colors, radius, fonts) | `src/styles/global.css` |
| AI, vendor and plugin icons | `src/data/icons.ts` (marks + colors), SVGs in `src/data/brand-icons.ts` |

Page sections, top to bottom: promo bar → nav → hero (agent card deck +
composer) → agent marquee → what is Fells → plans (Claude Code / Codex,
1×/2×/5×/20×, monthly/annual) → group plans (拼团, opening soon) + assurances → pay-as-you-go
table + marketplace → Developer API → clients → workspace mock → features →
surfaces → security → FAQ → referral → blog → waitlist CTA → footer.

Inner pages: `/market`, `/developer-api`, `/workspace`, `/agents`,
`/agents/{codex,claude-code,grok-build,opencode,kimi}`, `/security`, `/faq`, `/blog`,
plus `/app/start` (sign up / log in; no backend yet, only the email goes to the waitlist) and
`/checkout` (purchase entry: plans from the "Choose" buttons, or `?mode=credits` for top-ups),
each in all 6 languages. Use `link(t, "market")` for locale-aware internal links.

`/app` is the signed-in console prototype (front end only), modeled on the agent.space
console: onboarding, workspace switcher and example project, new chat with the agent picker,
chats, files, canvas, members, plugins, sites, scheduled tasks, workspace settings (5 tabs),
user settings, API keys, marketplace and plans & credits, plus top-up, subscribe, invite,
changelog and help dialogs. Views are hash routes (`/app#/billing/credits`). Rendering lives in
`src/scripts/app.ts`, copy in `src/i18n/app/*.ts`, data in `src/data/app.ts`. State is kept in
localStorage only: nothing is charged, uploaded or run. Top-up hands off to `/checkout`.

Changes from agent.space: sidebar items say why they're unavailable without a workspace
(instead of doing nothing); the model picker is grouped by maker, searchable, priced and newest
models only; ⌘K command palette; a spending guard (monthly limit, alert, pause); the API page shows
key creation and quick-start snippets instead of a hard gate; workspace export; preferences and
notification settings; light/dark/system theme; mobile drawer; onboarding answers preselect the
agent; top-up shows the balance after the payment.

No canvas or WebGL: every effect is CSS transforms/gradients, so the page stays
light. Motion respects `prefers-reduced-motion`.

## Before launch

- [ ] Prices in `src/data/catalog.ts` currently copy the agent.space template (Oct 2026); replace with Fells' own.
- [ ] Set `waitlistEndpoint` and confirm `contactEmail` in `src/site.ts`.
- [ ] Real API base URLs in `src/components/Api.astro` (`api.fells.dev` is a placeholder).
- [ ] Gemini 4 Argon and Grok 4.7 prices are placeholders; marketplace channel prices/metrics copy agent.space.
- [ ] Set `checkoutUrl` in `src/site.ts` (hosted payment page). Until then `/checkout` sends the order to the waitlist.
- [ ] `/app/start` is static: wire it to real auth before launch.
- [ ] `/app` runs on localStorage: connect it to Lody (workspaces, chats, files, cloud computer), real API keys and billing.
- [ ] Blog posts are titles only (marked "coming soon"); write them or hide the page.
- [ ] Blog links, referral amounts (`Referral.astro`), app download links.
- [ ] Legal review of group plans: consumer plans such as Claude Pro/Max and
      ChatGPT Pro generally forbid account sharing and resale; check each
      provider's terms before selling seats.
- [ ] Keep the Lody Apache-2.0 attribution (footer + FAQ) and its NOTICE in the app.
- [ ] Brand icons come from LobeHub Icons (`@lobehub/icons-static-svg`, MIT) and Simple Icons
      (CC0); the logos remain their owners' trademarks. Check each vendor's brand guidelines
      before launch.
