# Cine Paca — Frontend

**Interface web do catálogo pedagógico Cine Paca.** Aplicação Next.js para
exibição pública do acervo de curtas, documentários e animações brasileiras com
filtros por etapa, tipo, faixa etária e BNCC — além do painel administrativo
para curadoria de obras e listas.

- **Stack:** Next.js 16.2.9 (App Router) · React 19.2.4 · TypeScript 5 ·
  Tailwind CSS v4 · @base-ui/react · shadcn (CVA + cn) · tw-animate-css
- **Documentação do backend:** `GET /api/docs` com a API no ar

---

## Pré-requisitos

- Node.js 20+
- Backend Cine Paca rodando (ou usar a API hospedada em
  `https://cine-paca-api.onrender.com`)

---

## Setup

```bash
# 1. Dependências
npm install

# 2. Variáveis de ambiente
cp .env.example .env.local   # ajuste NEXT_PUBLIC_API_URL se necessário
```

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://cine-paca-api.onrender.com` | URL base da API (usada nas proxy rewrites) |
| `PORT` | `3000` | Porta HTTP local |

---

## Executando

```bash
npm run dev       # Desenvolvimento com hot reload em http://localhost:3000
npm run build     # Build de produção (.next/)
npm start         # Servir build de produção
npm run lint      # ESLint
```

---

## Convenções

### API Clients

**Dois clients** para contextos diferentes:

| Client | Módulo | Uso |
|--------|--------|-----|
| Server-side | `@/lib/services/` | Server Components — fetch direto ao backend |
| Client-side | `@/lib/api-client` | Componentes client — via proxy Next.js (`/api/**`) |

```ts
// Server Component
import { worksService } from "@/lib/services";

const result = await worksService.listPublic({ per_page: 5, stage: "Anos iniciais" });

// Client Component
import { clientApi } from "@/lib/api-client";

const res = await clientApi.post<WorkEntity>("/api/admin/works", payload);
```

### Filtros

Os valores de filtro usam as **strings de display da API**, não slugs:

| Parâmetro | Valores |
|-----------|---------|
| `type` | `short`, `documentary`, `animation` |
| `stage` | `Anos iniciais`, `Ensino Fundamental`, `Educação Infantil`, `Ensino médio` |

> A API faz correspondência ILIKE/substring em `stage`.
> A API de curadorias **não** suporta `stage` — o filtro é feito client-side.
> O parâmetro `pedagogical_use` retorna `400` e não deve ser usado.

### Autenticação Admin

- Login via `POST /api/auth/login` — retorna access token + cookie httpOnly de
  refresh.
- Access token armazenado em `localStorage` (sessão persistente).
- Logout remove o token do `localStorage` e redireciona para `/admin/login`.

### Descrições

- `short_description` é `null` para **todas** as obras na API — o texto real
  está em `synopsis`.
- Cards e páginas de detalhe usam `short_description ?? synopsis` como fallback.

---

## Rotas

### Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Home: hero, filtros de aula, grid de obras (1 destaque + 4 compactas), sidebar de intenção pedagógica |
| GET | `/obras` | Lista de obras com filtros (`q`, `type`, `stage`, `rating`) e paginação |
| GET | `/obras/[slug]` | Detalhe da obra: sinopse, ficha técnica, temas, BNCC, botão "Assistir" |
| GET | `/curadorias` | Lista de curadorias com filtro por etapa (client-side) |
| GET | `/curadorias/[slug]` | Detalhe da curadoria: sequência de obras, observação do curador, temas, BNCC |

### Admin (autenticação obrigatória)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/login` | Tela de login |
| GET | `/admin/obras` | Lista de obras (admin) |
| GET | `/admin/obras/nova` | Cadastrar nova obra |
| GET | `/admin/obras/[id]` | Editar obra |
| GET | `/admin/listas` | Lista de curadorias (admin) |
| GET | `/admin/listas/nova` | Criar nova curadoria |
| GET | `/admin/listas/[id]` | Editar curadoria |
| GET | `/admin/temas` | Gerenciar temas |
| GET | `/admin/temas/novo` | Criar tema |
| GET | `/admin/habilidades-bncc` | Gerenciar habilidades BNCC |
| GET | `/admin/habilidades-bncc/nova` | Criar habilidade BNCC |

### API Proxy

| Prefixo | Descrição |
|---------|-----------|
| `/api/**` | Proxy via Next.js rewrites para o backend (`rewrites()` no `next.config.ts`) |

---

## Design System (Figma)

### Colors

Tema Tailwind customizado com a paleta `cine-*`:

| Token | Hex | Uso |
|-------|-----|-----|
| `cine-50` | `#F8F5EF` | Fundo claro, texto em fundo escuro |
| `cine-200` | `#C9C1D9` | Texto secundário |
| `cine-300` | `#AA93F9` | Bordas e tags |
| `cine-800` | `#2E1E4A` | Fundo de cards compactos/default |
| `cine-900`/`cine-950` | — | Fundo de página |
| `cine-yellow` | — | Cor de destaque (classificação, botões, CTA) |
| `cine-card` | — | Fundo de card default |
| `cine-card-alt` | — | Fundo de card alternativo (sidebar) |
| `cine-text-dark` | `#181226` | Texto escuro em cards featured |

### Typography

- **Headings:** Sora (`font-heading`)
- **Corpo:** Inter
- **UI/Mono:** JetBrains Mono (labels, badges, tags)

### ObraCard Variants

| Variant | Descrição |
|---------|-----------|
| `featured` | Fundo claro (`bg-cine-50`), tags com fundo claro (`#E9E5FF`/`#CABFFE`/`#181226`), botões "Assistir" + "Ver detalhes" |
| `compact` | Card totalmente clicável (Link para `/obras/{slug}`), sem botões, `line-clamp-2` no título, `h-full` para altura consistente |
| `default` | Thumbnail clicável (Link para `/obras/{slug}`), botões "Assistir" (se houver `external_video_url`) + "Mais informações" |

---

## Deploy (Vercel)

### 1. Configuração

1. Importe o repositório na [Vercel](https://vercel.com).
2. Defina a variável de ambiente:
   - `NEXT_PUBLIC_API_URL` — URL da API em produção
3. O build usa `npm run build` — a Vercel detecta Next.js automaticamente.

### 2. Remote Patterns (Imagens)

O `next.config.ts` já lista os hosts permitidos para o Image Optimization.
Adicione novos hosts conforme necessário em `images.remotePatterns`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "cine-paca-api.onrender.com" },
    { protocol: "https", hostname: "**.supabase.co" },
    { protocol: "https", hostname: "**.cloudfront.net" },
    { protocol: "https", hostname: "**.s3.amazonaws.com" },
  ],
},
```

---

## Estrutura

```
src/
├── app/
│   ├── (public)/              # Páginas públicas
│   │   ├── page.tsx           # Home (hero, filtros, grid, sidebar)
│   │   ├── obras/             # Lista e detalhe de obras
│   │   └── curadorias/        # Lista e detalhe de curadorias
│   ├── admin/                 # Painel administrativo
│   │   ├── login/             # Tela de login
│   │   ├── obras/             # CRUD de obras
│   │   ├── listas/            # CRUD de curadorias
│   │   ├── temas/             # CRUD de temas
│   │   └── habilidades-bncc/  # CRUD de habilidades BNCC
│   └── api/                   # API routes (proxy para o backend)
├── components/
│   ├── public/                # Componentes públicos (ObraCard, search-filters, header)
│   ├── admin/                 # Componentes admin (work-form, list-form, admin-header)
│   └── ui/                    # Componentes base (Button, Checkbox, etc.)
├── lib/
│   ├── api-client.ts          # Client-side HTTP client
│   ├── auth-context.tsx        # Contexto de autenticação (login/logout/token)
│   ├── services/              # Server-side service layer
│   │   ├── index.ts           # Barrel export
│   │   ├── works.ts           # Lista/cria/atualiza obras
│   │   ├── lists.ts           # Lista/cria/atualiza curadorias
│   │   ├── themes.ts          # Temas
│   │   ├── bncc.ts            # Habilidades BNCC
│   │   ├── institutions.ts    # Instituições
│   │   ├── auth.ts            # Login, refresh, logout
│   │   ├── upload.ts          # Upload de imagens
│   │   ├── audit.ts           # Logs de auditoria
│   │   └── health.ts          # Health check
│   └── utils.ts               # cn() utility (shadcn)
└── types/
    └── api.ts                 # Tipos das entidades (WorkEntity, ListEntity, etc.)
```

---
