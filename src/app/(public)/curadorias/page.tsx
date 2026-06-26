import Link from "next/link";
import { listsService } from "@/lib/services";
import { ListCard } from "@/components/public/list-card";
import { FeaturedListCard } from "@/components/public/featured-list-card";

interface Props {
  searchParams: Promise<{ stage?: string }>;
}

const filterOptions = [
  { label: "Todas as listas", value: "" },
  { label: "Anos iniciais", value: "Anos iniciais" },
  { label: "Anos finais", value: "Anos finais" },
  { label: "Ensino Fundamental", value: "Ensino Fundamental" },
  { label: "Educação Infantil", value: "Educação Infantil" },
  { label: "Ensino médio", value: "Ensino médio" },
];

export default async function CuradoriasPage({ searchParams }: Props) {
  const params = await searchParams;
  const stageFilter = params.stage;

  const result = await listsService.listPublic({ per_page: 50 });
  const allLists = result.ok ? result.data.data : [];
  const lists = stageFilter
    ? allLists.filter((list) => list.stage === stageFilter)
    : allLists;

  const featured = lists[0];
  const remaining = lists.slice(1);

  return (
    <div className="flex w-full max-w-[1140px] flex-col items-center gap-6 mx-auto pb-14">
      {/* Hero */}
      <section className="flex w-full flex-col gap-4 overflow-hidden rounded-[22px] border border-cine-border bg-gradient-to-br from-[#24163D] via-[#291356] to-[#1E004E] px-5 py-8 md:px-10 md:py-14">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-7 bg-cine-yellow" />
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-yellow-light">
            SEQUÊNCIAS PRONTAS PARA AULA
          </span>
        </div>

        <h1 className="font-heading text-3xl md:text-5xl lg:text-[68px] font-bold leading-[1.02] tracking-tight text-cine-50 max-w-[760px]">
          Listas curatoriais para planejas com cinema brasileiro.
        </h1>

        <p className="max-w-[670px] text-lg leading-relaxed text-cine-200">
          Seleções feitas por curadores e administradores para apoiar
          professores por tema, etapa, tempo de aula e objetivo pedagógico.
        </p>
      </section>

      {/* Filter Pills */}
      <section className="flex w-full items-center gap-5 rounded-[18px] border border-cine-border bg-[rgba(42,26,69,0.82)] px-4 py-4">
        <span className="font-mono text-[11px] font-[400] uppercase tracking-[0.08em] text-cine-yellow-light shrink-0">
          LISTAS POR INTENÇÃO
        </span>
        <div className="flex items-center gap-2.5 flex-wrap">
          {filterOptions.map((filter) => {
            const isActive =
              filter.value === "" ? !stageFilter : stageFilter === filter.value;
            return (
              <Link
                key={filter.value}
                href={
                  filter.value
                    ? `/curadorias?stage=${filter.value}`
                    : "/curadorias"
                }
                className={`flex min-h-[38px] items-center rounded-full px-3.5 text-sm font-[560] transition-colors ${
                  isActive
                    ? "border border-cine-300 bg-cine-600 text-cine-50"
                    : "border border-cine-300/40 bg-cine-800/40 text-cine-200 hover:text-cine-50"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </section>

      {result.ok && lists.length > 0 ? (
        <div className="flex w-full flex-col gap-6">
          {/* Featured List */}
          {featured && <FeaturedListCard list={featured} />}

          {/* Remaining Lists Grid */}
          {remaining.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remaining.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <section className="flex w-full flex-col gap-6 overflow-hidden rounded-[18px] border border-cine-border bg-cine-card-alt p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-7 bg-cine-yellow" />
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-200">
                NENHUMA LISTA ENCONTRADA
              </span>
            </div>
            <h2 className="font-heading text-[46px] font-bold leading-[1.04] tracking-tight text-cine-50 max-w-[620px]">
              Nenhuma lista disponível com esse filtro.
            </h2>
            <p className="max-w-[620px] text-sm leading-relaxed text-cine-200">
              Ainda não publicamos listas curatoriais com esse recorte. Tente
              outro filtro ou volte mais tarde para conferir as novidades.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <Link
                href="/curadorias"
                className="flex min-h-[40px] items-center rounded-full bg-cine-yellow px-4 text-xs font-bold text-cine-text-dark"
              >
                Limpar filtros
              </Link>
              <Link
                href="/"
                className="flex min-h-[40px] items-center rounded-full border border-cine-50/20 px-4 text-xs font-bold text-cine-50"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
