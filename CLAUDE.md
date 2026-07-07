# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Landing page for **Nexxus Hub EJ**, the first junior marketing company (empresa júnior) of FURB (Blumenau, SC, Brazil), founded in 2026. The site targets small local businesses in the Vale do Itajaí region and must itself serve as the company's first portfolio piece. All user-facing content is in **Brazilian Portuguese**.

## Repository layout

- `código/` — the actual web app: Vite + React 18 (JavaScript, JSX, no TypeScript). Currently still the untouched Vite starter template; the real landing page has not been built yet.
- `gerenciamento/` — an Obsidian vault with project docs, not code. Key files:
  - `Briefing.md` — the authoritative brand briefing (design style, colors, tone of voice, culture, audience). Read it before making any design or copy decision.
  - `Requisitos Landing Page.md` — landing page requirements (currently a stub).
  - `Referências/` — visual reference PNGs and `Sites de Inspiração.md` (Gumroad and Bürocratik are the named design benchmarks).

## Commands

All commands run from `código/`:

```bash
npm run dev      # start Vite dev server with HMR
npm run build    # production build
npm run preview  # serve the production build locally
npm run lint     # ESLint (flat config, eslint.config.js)
```

There is no test setup.

## Brand constraints (from gerenciamento/Briefing.md)

These govern all UI and copy work — the briefing is the source of truth; this is the short version:

- **Palette**: navy `#13275c` (dominant backgrounds/headline text), medium blue `#234984`, pistachio green `#d7dea0`, light olive `#ced092`, white `#ffffff`. Layouts alternate navy backgrounds with white/green text and pistachio backgrounds with navy text. A lavender accent exists only for sticker outlines, never as a system color.
- **Design language**: sticker/collage aesthetic ("neobrutalist"-adjacent, Gumroad-style) — layered cutout elements with light outlines over sober navy backgrounds; flat design with no gradients, realistic shadows, or textures; depth comes from overlapping stickers only. Rounded geometric sans-serif typography (Poppins-like), bold uppercase titles; hierarchy via weight/scale/color, never by mixing font families.
- **Tone of voice**: young, warm, colloquial Portuguese with self-deprecating humor; didactic and jargon-free; opens with warmth ("primeiramente, um sorriso :)"). Ambitious but never pretentious.
- Brand assets include a circular "1ª Empresa Júnior de Marketing da FURB" seal, an "ej." mug monogram, a "HELLO" badge with handwritten script, a canine mascot, and organic petal shapes used as background ornaments.
