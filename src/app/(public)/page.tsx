import Link from "next/link";
import { worksService } from "@/lib/services";
import { ObraCard } from "@/components/public/obra-card";

export default async function HomePage() {
  const result = await worksService.listPublic({ per_page: 5 });

  const works = result.ok ? result.data.data : [];

  const featured = works[0];
  const secondary = works.slice(1);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[1140px] mx-auto pb-14">
      {/* Hero Section */}
      <section className="flex w-full flex-col gap-4 overflow-hidden rounded-[22px] border border-cine-border bg-gradient-to-br from-[#24163D] via-[#291356] to-[#1E004E] px-5 py-10 md:px-10 md:py-14">
        <div className="flex max-w-[900px] flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-7 bg-cine-yellow" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[68px] font-bold leading-[1.02] tracking-tight text-cine-50 max-w-[760px]">
            Cinema brasileiro para a sala de aula.
          </h1>

          <p className="max-w-[670px] text-sm md:text-lg leading-relaxed text-cine-200">
            Encontre curtas, longas e documentários com leitura pedagógica,
            indicação de faixa etária, BNCC e classificação indicativa para
            planejar aulas com segurança.
          </p>

          <form
            action="/obras"
            className="flex w-full items-center gap-2 md:gap-3 pt-4"
          >
            <div className="flex flex-1 items-center gap-2 md:gap-3 rounded-full border border-cine-50/20 bg-cine-50 px-4 md:px-5 py-2.5 md:py-3.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 22 22"
                fill="none"
                className="shrink-0 text-cine-400"
              >
                <path
                  d="M19.2499 19.2499L15.2624 15.2624M16.4999 10.5416C16.4999 13.8301 13.8301 16.4999 10.5416 16.4999C7.25309 16.4999 4.58325 13.8301 4.58325 10.5416C4.58325 7.25309 7.25309 4.58325 10.5416 4.58325C13.8301 4.58325 16.4999 7.25309 16.4999 10.5416L19.2499 19.2499"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                name="q"
                type="text"
                placeholder="Buscar por título, tema, BNCC ou palavra-chave"
                className="flex-1 bg-transparent text-xs md:text-sm text-cine-text-dark outline-none placeholder:text-[#868390]"
              />
            </div>
            <button
              type="submit"
              className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-cine-yellow"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-cine-text-dark"
              >
                <path
                  d="M5 12H18M18 12L13 7M18 12L13 17"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="flex w-full flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 rounded-[18px] border border-cine-border bg-[rgba(42,26,69,0.82)] px-4 py-4">
        <span className="shrink-0 font-mono text-[11px] font-[400] uppercase tracking-[0.08em] text-cine-yellow-light">
          FILTROS DE AULA
        </span>
        <div className="flex w-full md:w-auto items-center gap-2.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { label: "Tudo do acervo", href: "/obras" },
            { label: "Anos iniciais", href: "/obras?stage=Anos+iniciais" },
            {
              label: "Ensino Fundamental",
              href: "/obras?stage=Ensino+Fundamental",
            },
            { label: "Ensino médio", href: "/obras?stage=Ensino+m%C3%A9dio" },
            { label: "Curta-metragem", href: "/obras?type=short" },
            { label: "Documentário", href: "/obras?type=documentary" },
          ].map((filter, i) => (
            <Link
              key={filter.label}
              href={filter.href}
              className={`shrink-0 flex min-h-[38px] items-center rounded-full px-3.5 text-sm font-[560] transition-colors ${
                i === 0
                  ? "border border-cine-300 bg-cine-600 text-cine-50"
                  : "border border-cine-300/40 bg-cine-800/40 text-cine-200 hover:text-cine-50"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="flex w-full flex-col lg:flex-row gap-7">
        {/* Left: Featured Works Grid */}
        <div className="flex flex-1 flex-col gap-[18px]">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 md:gap-0">
            <div>
              <h2 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-cine-50">
                Obras para abrir conversa
              </h2>
            </div>
            <p className="max-w-none md:max-w-[460px] pr-0 md:pr-16 text-sm leading-relaxed text-cine-200">
              Seleção inicial com foco em cultura, imaginação, território e
              formação audiovisual, pronta para o olhar do professor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.18fr_1fr_1fr] md:grid-rows-2 gap-4">
            {featured ? (
              <ObraCard
                work={featured}
                variant="featured"
                className="md:col-span-1 md:row-span-2"
              />
            ) : (
              <div className="md:col-span-1 md:row-span-2 flex items-center justify-center rounded-2xl border border-cine-border bg-cine-card p-8 text-cine-200">
                Em breve
              </div>
            )}

            {secondary.length > 0
              ? secondary.map((work) => (
                  <ObraCard key={work.id} work={work} variant="compact" />
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-2xl border border-cine-border bg-cine-card p-8 text-cine-200"
                  >
                    Em breve
                  </div>
                ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="flex w-full lg:w-[292px] shrink-0 flex-col gap-2.5 rounded-[18px] border border-cine-border bg-cine-card-alt p-6 self-start">
          <h3 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
            Planeje pela intenção pedagógica
          </h3>
          <p className="text-sm leading-relaxed text-cine-200 pt-2">
            Além do título, o catálogo prioriza critérios que ajudam o professor
            a decidir antes de abrir a obra.
          </p>

          <div className="flex flex-col gap-2.5 pt-5">
            {[
              {
                label: "FAIXA ETÁRIA",
                text: "Filmes livres, 10+, 12+ e 14+ com leitura clara.",
              },
              {
                label: "ETAPA",
                text: "Obras para anos iniciais, finais e ensino médio com recorte pedagógico.",
              },
              {
                label: "DURAÇÃO",
                text: "Curtas de 5 a 15 min ideais para exibição e conversa em um período.",
              },
              {
                label: "BNCC",
                text: "Cada obra conectada a códigos da BNCC para planejamento alinhado à base.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 rounded-xl border border-cine-border/70 bg-cine-800/40 p-3.5"
              >
                <span className="font-mono text-[11px] font-[400] uppercase tracking-[0.07em] text-cine-yellow-light">
                  {item.label}
                </span>
                <span className="text-sm font-[560] leading-relaxed text-cine-50">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
