<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Website Reverse-Engineer Template

## What This Is
A reusable template for reverse-engineering any website and rebuilding it as a faithful clone using Claude Code. The Next.js + shadcn/ui + Tailwind v4 base is pre-scaffolded — just fill in TARGET.md and run `/clone-website`.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **UI:** shadcn/ui (Radix primitives, Tailwind CSS v4, `cn()` utility)
- **Icons:** Lucide React (default — will be replaced/supplemented by extracted SVGs)
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **Deployment:** Vercel

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes, no inline styles
- 2-space indentation
- Responsive: mobile-first

## Design Principles
- **Pixel-perfect emulation** — match the target's spacing, colors, typography exactly
- **No personal aesthetic changes during emulation phase** — match 1:1 first, customize later
- **Real content** — use actual text and assets from the target site, not placeholders
- **Beauty-first** — every pixel matters

## Project Structure
```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # Extracted SVG icons as React components
  lib/
    utils.ts        # cn() utility (shadcn)
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # Downloaded images from target site
  videos/           # Downloaded videos from target site
  seo/              # Favicons, OG images, webmanifest
docs/
  research/         # Inspection output (design tokens, components, layout)
  design-references/ # Screenshots and visual references
scripts/            # Asset download scripts
```

## MOST IMPORTANT NOTES
- When launching Claude Code agent teams, ALWAYS have each teammate work in their own worktree branch and merge everyone's work at the end, resolving any merge conflicts smartly since you are basically serving the orchestrator role and have full context to our goals, work given, work achieved, and desired outcomes.

@docs/research/INSPECTION_GUIDE.md
@TARGET.md


# PROJECT: 
FashionHero Marketplace
# ROLE: 
Budujesz feature'y dla FashionHero - marketplace'u modowego (2.4M kupujących, 4,200 sprzedawców, ~300 tys. zamówień/miesiąc).

# Cel aplikacji
FashionHero łączy sprzedawców mody z kupującymi. Model przychodowy: 22% prowizji od transakcji. Aktualny focus: obniżenie 38% wskaźnika zwrotów (strona kosztowa) i dywersyfikacja przychodów poza prowizję (strona przychodowa).

# Styl kodu
TypeScript strictly - żadnych typów any
Używaj istniejących komponentów i wzorców z codebase zamiast tworzyć nowe od zera

# Reguły domenowe
Sprzedawcy to niezależne sklepy, nie pracownicy FashionHero

# Polityka zwrotów: 
darmowe zwroty w ciągu 14 dni (FashionHero płaci ~15 PLN za zwrot)
Średnia wartość zamówienia: ~200 PLN. Średnia prowizja: ~44 PLN.

# Granice
## ALWAYS:
Loading state: każde async call ma spinner ≥1s i error state z retry CTA.
        Empty state: brak danych = dedykowany komponent, nie pusty div.
        Zwrot: flow inicjacji zwrotu nie może dotykać kodu checkout.
Pokazuj empty states (nie zepsute layouty) gdy brakuje danych
Zachowuj istniejącą funkcjonalność przy dodawaniu nowych feature'ów
Używaj istniejących komponentów UI dla spójności z resztą aplikacji
## ASK FIRST:
Przed zmianą jakiegokolwiek flow checkout/płatności
Przed modyfikacją autentykacji użytkowników
Przed dodaniem nowej biblioteki lub zależności
Przed zmianą struktury bazy danych
Przed zmianą nawigacji lub layoutu strony

## NEVER:
Nie pokazuj danych finansowych sprzedawcy (marże, prowizje) kupującym
### Example: 
	Bad: ProductCard: { price: 200, sellerMargin: 45, fashionheroFee: 44 }
	Good: ProductCard: { price: 200, displayPrice: '200 PLN' }"
Nie hardcoduj cen ani logiki biznesowej która powinna być w bazie danych
Nie usuwaj ani nie modyfikuj istniejących feature'ów, komponentów ani styli chyba że użytkownik o to poprosi
Nie zmieniaj istniejącego kodu który nie jest bezpośrednio związany z aktualnym zadaniem