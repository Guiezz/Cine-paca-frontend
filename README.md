# Cine Paca

**Plataforma de curadoria de filmes brasileiros para a sala de aula.**

Catálogo pedagógico de curtas, documentários e animações brasileiras com
indicação de faixa etária, conexão com a BNCC e sugestões de uso em sala.
Curadores organizam obras em listas temáticas prontas para o professor usar.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16.2.9 (App Router) |
| Linguagem | TypeScript 5 |
| Estilos | Tailwind CSS v4 |
| Componentes | @base-ui/react |
| UI utilities | shadcn (CVA + cn), tw-animate-css |
| Runtime | Node.js 20+ |

---

## Getting Started

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento com hot reload |
| `npm run build` | Build de produção |
| `npm start` | Servir build de produção |
| `npm run lint` | ESLint |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Páginas públicas
│   │   ├── page.tsx       # Home (hero, filtros, grid de obras, sidebar)
│   │   ├── obras/         # Listagem e detalhe de obras
│   │   └── curadorias/    # Listagem e detalhe de curadorias
│   ├── admin/             # Painel administrativo
│   │   ├── obras/         # CRUD de obras
│   │   ├── curadorias/    # CRUD de listas
│   │   ├── temas/         # CRUD de temas
│   │   └── habilidades-bncc/ # CRUD de habilidades BNCC
│   └── api/               # Proxy routes para o backend
├── components/
│   ├── public/            # Componentes públicos (ObraCard, search-filters)
│   └── admin/             # Componentes admin (work-form, list-form)
├── lib/
│   ├── api.ts             # Server-side API client
│   ├── api-client.ts      # Client-side API client (via /api/**)
│   ├── services.ts        # Service layer com tipagem
│   └── utils.ts           # cn() utility (shadcn)
└── types/
    └── api.ts             # Tipos das entidades (WorkEntity, ListEntity, etc.)
```

---

## API Patterns

**Dois clients** para contextos diferentes:

### Server-side (`@/lib/api`)

Usado dentro de Server Components para fetch direto ao backend.

```ts
import { worksService } from "@/lib/services";

const result = await worksService.listPublic({ per_page: 5, stage: "Anos iniciais" });
if (result.ok) {
  const works = result.data.data;
}
```

### Client-side (`@/lib/api-client`)

Usado em componentes client para operações via `/api/**` (admin CRUD).

```ts
import { clientApi } from "@/lib/api-client";

const res = await clientApi.post<WorkEntity>("/api/admin/works", payload);
```

### Filter Values

Os filtros usam as **strings de display da API**, não slugs:

- **Stage**: `"Anos iniciais"`, `"Ensino Fundamental"`, `"Educação Infantil"`, `"Ensino médio"`
- **Type**: `"short"`, `"documentary"`, `"animation"`
- A API faz correspondência ILIKE/substring, então `?stage=Ensino+Fundamental` retorna obras cujo stage contenha "Ensino Fundamental"

> **Importante**: A API de curadorias (lists) **não** suporta filtro `stage` — o filtro é feito client-side. O parâmetro `pedagogical_use` retorna 400 e não deve ser usado.

---

## Design System (Figma)

### Colors

Tema Tailwind customizado com a paleta `cine-*`:

| Token | Uso |
|-------|-----|
| `cine-50` (#F8F5EF) | Fundo claro, texto em fundo escuro |
| `cine-200` (#C9C1D9) | Texto secundário |
| `cine-300` (#AA93F9) | Bordas e tags |
| `cine-800` (#2E1E4A) | Fundo de cards |
| `cine-900` / `cine-950` | Fundo de página |
| `cine-yellow` | Cor de destaque (classificação, botões, CTA) |
| `cine-card` | Fundo de card default |
| `cine-card-alt` | Fundo de card alternativo (sidebar) |
| `cine-text-dark` (#181226) | Texto escuro em cards featured |

### Typography

- **Headings**: Sora (`font-heading`)
- **Corpo**: Inter
- **UI/Mono**: JetBrains Mono (labels, badges)

### Home Page Layout

```
┌─────────────────────────────┬──────────┐
│  Obras para abrir conversa  │  Sidebar │
│  ┌──────────┬──────┬──────┐ │  292px   │
│  │ Featured │ C1R1 │ C2R1 │ │          │
│  │ (1.18fr) ├──────┼──────┤ │          │
│  │          │ C1R2 │ C2R2 │ │          │
│  └──────────┴──────┴──────┘ │          │
└─────────────────────────────┴──────────┘
```

### ObraCard Variants

| Variant | Comportamento |
|---------|--------------|
| `featured` | Card inteiro visível, tags com fundo claro, botões "Assistir" + "Ver detalhes" |
| `compact` | Card totalmente clicável (Link para `/obras/{slug}`), sem botões, `line-clamp-2` no título |
| `default` | Thumbnail clicável (Link para `/obras/{slug}`), botões "Assistir" (se tiver vídeo) + "Mais informações" |

---

## Admin

### Work Form

- Tipo e etapa usam `<Select>` dropdowns
- `short_description` é enviado também como `synopsis` (campo obrigatório na API)
- Capa via `ImageUpload`

### List (Curadoria) Form

- `cover_image_url` com `ImageUpload`
- `admin_note` textarea — único campo de texto livre na API de listas

---

## Known Issues

- `cdpn.cinepaca.example` não resolve — causa erro 500 no Image Optimization para obras com esse domínio em `thumbnail_image_url`
- `pedagogical_use` como filtro não funciona — backend não tem suporte
- Seção "Preparação da aula" (ANTES/DURANTE/DEPOIS) depende de um segundo campo na API — atualmente só `admin_note` existe
