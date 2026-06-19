<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cine Paca Frontend

## Stack
- **Next.js** 16.2.9 (React 19.2.4) — App Router, Server Components by default
- **Tailwind CSS v4** — uses `@tailwindcss/postcss`, no `tailwind.config.js`
- **@base-ui/react** — for primitive UI components (Select, Dialog, etc.)
- **shadcn** patterns — CVA + cn() utility in `@/lib/utils`
- **tw-animate-css** — animation utilities

## Project Structure
- `src/app/(public)/` — public pages (home, /obras, /curadorias, /obras/[slug], /curadorias/[slug])
- `src/app/admin/` — admin pages (works CRUD, lists/themes/skills management)
- `src/app/api/` — Next.js API proxy routes (wraps backend API)
- `src/components/public/` — public components (ObraCard, search-filters, etc.)
- `src/components/admin/` — admin components (work-form, list-form, etc.)
- `src/lib/` — utilities (api.ts client, services.ts, utils.ts)
- `src/types/api.ts` — TypeScript types for API entities

## API Patterns
- **Two clients**: `@/lib/api` (server-side fetch) and `@/lib/api-client` (client-side via Next.js API routes at `/api/**`)
- **Entity types** in `@/types/api`: WorkEntity, ListEntity, ThemeEntity, BnccSkillEntity
- **Filter values** use API display strings, not slugs:
  - Stage: `"Anos iniciais"`, `"Ensino Fundamental"`, `"Educação Infantil"`, `"Ensino médio"`
  - Type: `"short"`, `"documentary"`, `"animation"` (NOT `"short_film"`, `"feature_film"`, `"series"`)
  - Lists API does NOT support `stage` filter — filtering is done client-side
  - `pedagogical_use` is NOT a supported API filter — returns 400
- **Work form** sends `short_description` (the actual API field) and `synopsis` (API-required field) as the same value
- **Descriptions**: `short_description` is null for ALL works in API — actual text is in `synopsis`. All cards/ detail pages use `short_description ?? synopsis` as fallback

## Design (Figma-based)
- **Colors**: custom Tailwind theme (cine-50 through cine-950, cine-yellow, cine-card, cine-card-alt, cine-text-dark)
- **Typography**: Sora for headings (`font-heading`), Inter/ JetBrains Mono for UI text
- **Home page grid**: `grid-cols-[1.18fr_1fr_1fr] grid-rows-2` — featured card spans 2 rows in col 1, 4 compact cards fill cols 2-3
- **Cards** (`ObraCard`):
  - `featured` variant: light bg (bg-cine-50), dark text, light-themed tags (bg #E9E5FF, border #CABFFE, text #181226)
  - `compact` variant: fully clickable card (wraps in Link to `/obras/{slug}`), no buttons, `line-clamp-2` on title, `h-full` for consistent sizing
  - `default` variant: thumbnail is clickable (links to detail page), buttons remain (Assistir links to external_video_url, Mais informações links to detail page)

## Admin Forms
- **work-form.tsx**: type/stage use `<Select>` dropdowns; short_description + synopsis sent as same value; cover image upload
- **list-form.tsx**: cover_image_url upload field; `admin_note` textarea (only free-text field in lists API)

## Home Page Responsive Breakpoints
- **Mobile (<768px)**: hero text scales (3xl → 5xl → 68px), filter pills overflow-x-auto, grid is single column, sidebar stacks below, header shows hamburger menu
- **Desktop (≥768px)**: hero full size, pills inline, 3-column grid (1.18fr 1fr 1fr), sidebar at 292px
- **Grid classes**: `grid-cols-1 md:grid-cols-[1.18fr_1fr_1fr] md:grid-rows-2`, featured card uses `md:col-span-1 md:row-span-2`
- **Layout padding**: `<main>` has `px-5 lg:px-0` (public layout); sections have responsive padding
- **Header**: `relative` with hamburger button (`flex md:hidden`); dropdown menu absolute below; nav hidden on mobile
- Logo scales: `36x44` → `56x69`, text `text-sm` → `text-lg`
- Filter pills section: `flex-col md:flex-row`, pills container `overflow-x-auto`
- Public home page, obras list + detail, curadorias list + detail all functional
- Admin CRUD for works, lists, themes, BNCC skills functional
- Filter values aligned with backend API display strings
- Work description uses synopsis as fallback when short_description is null

## Known Issues / Blockers
- `cdpn.cinepaca.example` does NOT resolve — causes Image Optimization 500 errors for works with that domain in `thumbnail_image_url`
- `padagogical_use` filter cannot work until backend adds support
- "Preparação da aula" (ANTES/DURANTE/DEPOIS) section on detail page needs a second API field — currently only `admin_note` exists
