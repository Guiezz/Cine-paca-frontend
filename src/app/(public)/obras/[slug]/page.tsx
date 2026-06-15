import { notFound } from "next/navigation";
import Image from "next/image";
import { worksService } from "@/lib/services";

interface Props {
  params: Promise<{ slug: string }>;
}

const typeLabels: Record<string, string> = {
  short_film: "Curta-metragem",
  feature_film: "Longa-metragem",
  documentary: "Documentário",
  animation: "Animação",
  series: "Série",
};

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;

  const result = await worksService.getBySlug(slug);

  if (!result.ok) {
    notFound();
  }

  const work = result.data;

  const metadata = [
    { label: "TÍTULO", value: work.title },
    { label: "TIPO", value: typeLabels[work.type] ?? work.type },
    { label: "DURAÇÃO", value: `${work.duration_minutes} minutos` },
    { label: "CLASSIFICAÇÃO", value: work.rating },
    { label: "ETAPA SUGERIDA", value: work.stage ?? "—" },
    { label: "ÁREAS", value: work.bncc_skills?.map((s) => s.area).join(", ") ?? "—" },
  ];

  return (
    <div className="flex flex-col w-full max-w-[1140px] mx-auto pb-14 gap-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        <span className="text-cine-200/80">Catálogo</span>
        <span className="text-cine-200/80">/</span>
        <span className="text-cine-200/80">Busca</span>
        <span className="text-cine-200/80">/</span>
        <span className="text-cine-50">Detalhes da obra</span>
      </nav>

      {/* Hero Section */}
      <section className="flex gap-7">
        {/* Thumbnail */}
        <div className="flex w-[732px] flex-col overflow-hidden rounded-[22px] border border-cine-border bg-cine-card shadow-[0_28px_70px_0_rgba(0,0,0,0.28)]">
          <div className="relative flex aspect-[73/41] w-full items-center justify-center overflow-hidden bg-cine-900">
            {work.hero_image_url || work.thumbnail_image_url ? (
              <Image
                src={work.hero_image_url ?? work.thumbnail_image_url!}
                alt={work.title}
                fill
                sizes="732px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cine-800 to-cine-950">
                <span className="text-cine-200">Frame da obra</span>
              </div>
            )}
            {work.external_video_url && (
              <a
                href={work.external_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute left-1/2 top-1/2 flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cine-yellow"
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M10 6.25V23.75L23.75 15L10 6.25Z" fill="#181226" />
                </svg>
              </a>
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-[620] text-cine-50">
              Disponível para uso educacional
            </span>
            <span className="text-sm text-cine-200">
              {typeLabels[work.type] ?? work.type}
              {work.duration_minutes ? ` · ${work.duration_minutes} min` : ""}
            </span>
          </div>
        </div>

        {/* Detail Aside */}
        <div className="flex w-[380px] shrink-0 flex-col gap-3 rounded-[22px] border border-cine-border bg-[radial-gradient(103.85%_176.36%_at_88%_10%,rgba(255,182,0,0.14)_0%,rgba(255,182,0,0)_13.23%),_#221439] px-7 py-9">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-7 bg-cine-yellow" />
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-yellow-light">
              DETALHES DA OBRA
            </span>
          </div>

          <h1 className="font-heading text-[58px] font-bold leading-[1.03] tracking-tight text-cine-50">
            {work.title}
          </h1>

          <p className="text-justify text-sm leading-relaxed text-cine-200">
            {work.short_description ?? work.synopsis}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center rounded-full bg-cine-yellow px-2.5 py-1 text-xs font-bold text-cine-text-dark">
              {work.rating}
            </span>
            {work.bncc_skills?.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50"
              >
                BNCC {skill.area}
              </span>
            ))}
            {work.themes?.slice(0, 2).map((theme) => (
              <span
                key={theme.id}
                className="flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50"
              >
                {theme.name}
              </span>
            ))}
            {work.stage && (
              <span className="flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50">
                {work.stage}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2.5 pt-2.5">
            {work.external_video_url && (
              <a
                href={work.external_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[42px] items-center rounded-full bg-cine-yellow px-4 text-xs font-bold text-cine-text-dark"
              >
                Assistir agora
              </a>
            )}
            <button className="flex min-h-[42px] items-center rounded-full border border-cine-50/20 px-4 text-xs font-bold text-cine-50">
              Salvar na lista
            </button>
          </div>

          {/* Sinopse (within aside on Figma) */}
          <div className="mt-6 border-t border-cine-border pt-6">
            <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
              Sinopse
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-cine-50/80">
              {work.synopsis}
            </p>
          </div>
        </div>
      </section>

      {/* Lower Section: Two Columns */}
      <section className="grid grid-cols-[1fr_360px] gap-7">
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          {/* Ficha Técnica */}
          <div className="rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
            <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
              Ficha técnica e curatorial
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {metadata.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1.5 rounded-xl border border-cine-border/70 bg-cine-900/35 p-3.5"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-cine-yellow-light">
                    {item.label}
                  </span>
                  <span className="text-sm font-[560] leading-relaxed text-cine-50">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Uso em Sala */}
          <div className="rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
            <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
              Uso em sala
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-cine-200">
              A curadoria destaca possibilidades de mediação para o professor decidir
              rapidamente se a obra combina com o objetivo da aula.
            </p>

            {work.pedagogical_use && (
              <div className="mt-4 rounded-xl border border-cine-border/70 bg-cine-900/35 p-3.5">
                <p className="text-sm font-[560] leading-relaxed text-cine-50">
                  {work.pedagogical_use}
                </p>
              </div>
            )}

            {work.trigger_question && (
              <div className="mt-3 rounded-2xl bg-[#F9F4EA] p-5">
                <span className="font-mono text-[11px] font-[400] uppercase tracking-[0.07em] text-[#270C88]">
                  PERGUNTA DISPARADORA
                </span>
                <p className="mt-2 text-sm font-[560] leading-relaxed text-cine-text-dark">
                  {work.trigger_question}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* Leitura Pedagógica */}
          <div className="flex flex-col gap-3.5 rounded-[18px] border border-cine-300/40 bg-cine-800/40 p-5">
            <h2 className="font-heading text-[21px] font-bold leading-tight tracking-tight text-cine-50">
              Leitura pedagógica
            </h2>
            <div className="flex flex-col gap-2.5">
              {[
                {
                  label: "BNCC",
                  text: work.bncc_skills?.length
                    ? work.bncc_skills.map((s) => `${s.code} — ${s.description}`).join(". ")
                    : "Obra conectada à Base Nacional Comum Curricular.",
                },
                {
                  label: "Faixa etária",
                  text: work.age_range
                    ? `Indicado para ${work.age_range}.`
                    : "Consulte a classificação indicativa.",
                },
                {
                  label: "Objetivo",
                  text: work.pedagogical_use ?? "Estimular observação, escuta e conversa sobre linguagem audiovisual.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 rounded-xl bg-cine-300/20 p-3"
                >
                  <span className="text-sm font-bold leading-relaxed text-cine-50">
                    {item.label}
                  </span>
                  <p className="text-xs leading-relaxed text-cine-200">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Obras Relacionadas */}
          <div className="flex flex-col gap-3.5 rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
            <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
              Obras relacionadas
            </h2>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-cine-border/60 bg-cine-800/35 p-2.5"
                >
                  <div className="aspect-[23/15] w-[92px] shrink-0 overflow-hidden rounded-lg bg-cine-800">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cine-700 to-cine-950">
                      <span className="text-[10px] text-cine-200">Frame</span>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="truncate font-heading text-sm font-bold leading-snug tracking-tight text-cine-50">
                      Em breve
                    </h3>
                    <p className="text-xs leading-relaxed text-cine-200">
                      Mais obras em destaque em breve.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
