import Link from "next/link";
import { worksService } from "@/lib/services";
import { SearchForm } from "@/components/public/search-form";
import { SearchFilters } from "@/components/public/search-filters";
import { ObraCard } from "@/components/public/obra-card";
import { SearchActiveFilters } from "./search-active-filters";
import { SearchSort } from "./search-sort";

interface Props {
  searchParams: Promise<{ q?: string; stage?: string; type?: string; pedagogical_use?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q;
  const stage = params.stage;
  const type = params.type;
  const pedagogical_use = params.pedagogical_use;
  const page = params.page ? Number(params.page) : 1;

  const apiParams: Record<string, string | number | boolean | undefined> = { page };
  if (q) apiParams.q = q;
  if (stage) apiParams.stage = stage;
  if (type) apiParams.type = type;
  if (pedagogical_use) apiParams.pedagogical_use = pedagogical_use;

  const result = await worksService.listPublic(apiParams);
  const hasActiveFilters = !!(q || stage || type || pedagogical_use);

  const buildActiveFilters = () => {
    const filters: { label: string; param: string; value: string }[] = [];
    if (stage) filters.push({ label: "Etapa", param: "stage", value: stage === "ensino_fundamental_ii" ? "Ensino Fundamental II" : stage.replace(/_/g, " ") });
    if (pedagogical_use) filters.push({ label: "Uso em sala", param: "pedagogical_use", value: pedagogical_use.replace(/_/g, " ") });
    return filters;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[1140px] mx-auto pb-14">
      {/* Hero / Search Section */}
      <section className="flex w-full flex-col gap-4 overflow-hidden rounded-[22px] border border-cine-border bg-gradient-to-br from-[#24163D] via-[#291356] to-[#1E004E] px-8 py-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-7 bg-cine-yellow" />
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-yellow-light">
              BUSCA NO ACERVO
            </span>
          </div>

          {result.ok && result.data.data.length > 0 ? (
            <h1 className="font-heading text-[54px] font-bold leading-[1.03] tracking-tight text-cine-50 max-w-[720px]">
              {q ? `Resultados para "${q}"` : "Catálogo completo"}
            </h1>
          ) : (
            <h1 className="font-heading text-[54px] font-bold leading-[1.03] tracking-tight text-cine-50 max-w-[720px]">
              Nenhuma obra encontrada
            </h1>
          )}
        </div>

        {result.ok && result.data.data.length > 0 ? (
          <p className="max-w-[640px] text-base leading-relaxed text-cine-200">
            {result.data.pagination.total_items} obra{result.data.pagination.total_items !== 1 ? "s" : ""} encontrada{result.data.pagination.total_items !== 1 ? "s" : ""}
            {hasActiveFilters ? " com recorte pedagógico ativo." : "."}
          </p>
        ) : (
          <p className="max-w-[640px] text-base leading-relaxed text-cine-200">
            Não encontramos resultados{q ? ` para "${q}"` : ""} com os filtros pedagógicos ativos. Você pode remover critérios ou explorar sugestões próximas do acervo.
          </p>
        )}

        <div className="w-full max-w-[820px]">
          <SearchForm initialQuery={q ?? ""} />
        </div>
      </section>

      {/* Active Filters */}
      <SearchActiveFilters hasActiveFilters={hasActiveFilters} filters={buildActiveFilters()} />

      {/* Main Content */}
      <section className="flex w-full gap-7">
        {/* Sidebar Filters */}
        <SearchFilters />

        {/* Results */}
        <div className="flex flex-1 flex-col gap-[18px]">
          {result.ok && result.data.data.length > 0 ? (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-7 bg-cine-yellow" />
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-yellow-light">
                      {result.data.pagination.total_items} RESULTADOS
                    </span>
                  </div>
                  <h2 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-cine-50">
                    Obras compatíveis
                  </h2>
                </div>
                <SearchSort />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {result.data.data.map((work) => (
                  <ObraCard key={work.id} work={work} variant="default" />
                ))}
              </div>

              {/* Pagination */}
              {result.data.pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  {Array.from({ length: result.data.pagination.total_pages }, (_, i) => i + 1).map(
                    (p) => {
                      const params = new URLSearchParams();
                      if (q) params.set("q", q);
                      if (stage) params.set("stage", stage);
                      if (type) params.set("type", type);
                      if (pedagogical_use) params.set("pedagogical_use", pedagogical_use);
                      params.set("page", String(p));

                      return (
                        <a
                          key={p}
                          href={`/obras?${params.toString()}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                            p === page
                              ? "bg-cine-yellow text-cine-text-dark"
                              : "text-cine-200 hover:bg-cine-600 hover:text-cine-50"
                          }`}
                        >
                          {p}
                        </a>
                      );
                    },
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Empty State */}
              <div className="flex flex-col gap-6 overflow-hidden rounded-[18px] border border-cine-border bg-cine-card-alt p-8">
                <div className="flex gap-7">
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-7 bg-cine-yellow" />
                      <span className="font-mono text-sm uppercase tracking-[0.08em] text-cine-200">
                        SEM RESULTADO DIRETO
                      </span>
                    </div>
                    <h2 className="font-heading text-[46px] font-bold leading-[1.04] tracking-tight text-cine-50 max-w-[620px]">
                      Esse termo não apareceu no acervo curado.
                    </h2>
                    <p className="max-w-[620px] text-sm leading-relaxed text-cine-200">
                      O Cine Paca prioriza obras brasileiras disponíveis para uso educacional.
                      Para continuar, tente uma busca por tema, remova um filtro ou explore
                      obras que trabalham objetivos parecidos.
                    </p>
                    <div className="flex items-center gap-2.5 pt-2">
                      <Link
                        href="/obras"
                        className="flex min-h-[40px] items-center rounded-full bg-cine-yellow px-4 text-xs font-bold text-cine-text-dark"
                      >
                        Limpar filtros
                      </Link>
                      <Link
                        href="/"
                        className="flex min-h-[40px] items-center rounded-full border border-cine-50/20 px-4 text-xs font-bold text-cine-50"
                      >
                        Ver todo o acervo
                      </Link>
                    </div>
                  </div>

                  <div className="flex aspect-square w-[220px] shrink-0 items-center justify-center rounded-[28px] border border-cine-300/50 bg-gradient-to-br from-[#614C91] to-cine-900">
                    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                      <path
                        d="M28.8 19.2H67.2C74.2645 19.2 80 24.9354 80 32V56C80 63.0645 74.2645 68.8 67.2 68.8H28.8C21.7355 68.8 16 63.0645 16 56V32C16 24.9354 21.7355 19.2 28.8 19.2Z"
                        stroke="#FFD366"
                        strokeWidth="4.8"
                      />
                      <path d="M36 38.4H60M36 50.4H50.4" stroke="#FFD366" strokeWidth="4.8" strokeLinecap="round" />
                      <path d="M38.4 76.8H57.6" stroke="#FFD366" strokeWidth="4.8" strokeLinecap="round" />
                      <path
                        d="M35.2 14.4L27.2 5.6M60.8 14.4L68.8 5.6"
                        stroke="#FFD366"
                        strokeWidth="4.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex flex-col gap-4 rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-7 bg-cine-yellow" />
                      <span className="font-mono text-sm uppercase tracking-[0.08em] text-cine-200">
                        SUGESTÕES PRÓXIMAS
                      </span>
                    </div>
                    <h2 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-cine-50">
                      Obras para continuar a curadoria
                    </h2>
                  </div>
                  <p className="max-w-[430px] text-sm leading-relaxed text-cine-200">
                    Alternativas com temas próximos para planejar a aula sem depender do título exato.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col overflow-hidden rounded-2xl border border-cine-border bg-cine-800/40"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-cine-800">
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cine-700 to-cine-950 p-4">
                          <span className="text-sm text-cine-200">Em breve</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 p-4">
                        <h3 className="font-heading text-lg font-bold leading-snug text-cine-50">
                          Em breve
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
