import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { listsService } from "@/lib/services";

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

export default async function CuradoriaDetailPage({ params }: Props) {
  const { slug } = await params;

  const result = await listsService.getBySlug(slug);

  if (!result.ok) {
    notFound();
  }

  const list = result.data;
  const items = list.items ?? [];

  return (
    <div className="flex w-full max-w-[1140px] flex-col items-center gap-5 mx-auto pb-14">
      {/* Breadcrumb */}
      <nav className="flex w-full items-center gap-1 text-sm">
        <Link href="/" className="text-cine-200/80 hover:text-cine-50">
          Catálogo
        </Link>
        <span className="text-cine-200/80">/</span>
        <Link
          href="/curadorias"
          className="text-cine-200/80 hover:text-cine-50"
        >
          Listas curatoriais
        </Link>
        <span className="text-cine-200/80">/</span>
        <span className="text-cine-50">{list.title}</span>
      </nav>

      {/* Hero */}
      <section className="flex w-full flex-col gap-4 overflow-hidden rounded-[22px] border border-cine-border bg-gradient-to-br from-[#24163D] via-[#291356] to-[#1E004E] px-10 py-14">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-7 bg-cine-yellow" />
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-yellow-light">
            LISTA CURATORIAL
          </span>
        </div>

        <h1 className="font-heading text-[68px] font-bold leading-[1.02] tracking-tight text-cine-50 max-w-[760px]">
          {list.title}
        </h1>

        <p className="max-w-[640px] text-lg leading-relaxed text-cine-200">
          {list.description}
        </p>

        {(list.stage ||
          (list.themes && list.themes.length > 0) ||
          list.estimated_duration_minutes) && (
          <div className="flex flex-wrap gap-2">
            {list.stage && (
              <span className="flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50">
                {list.stage}
              </span>
            )}
            {list.estimated_duration_minutes && (
              <span className="flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50">
                {list.estimated_duration_minutes} min
              </span>
            )}
            {list.themes?.slice(0, 3).map((theme) => (
              <span
                key={theme.id}
                className="flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50"
              >
                {theme.name}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Two-Column Layout */}
      <section className="grid w-full grid-cols-[1fr_360px] gap-7">
        {/* Main Column */}
        <div className="flex flex-col gap-5">
          {/* Admin Note / Pedagogical Context */}
          {list.admin_note && (
            <div className="rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
              <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
                Resumo pedagógico
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cine-200">
                {list.admin_note}
              </p>
            </div>
          )}

          {/* Sequence of Works */}
          <div className="rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-7 bg-cine-yellow" />
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-yellow-light">
                {items.length} {items.length === 1 ? "OBRA" : "OBRAS"} NA
                SEQUÊNCIA
              </span>
            </div>

            <h2 className="mt-2 font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
              Sequência das obras
            </h2>

            {items.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[178px_1fr] gap-4 rounded-2xl border border-cine-border/60 bg-cine-800/35 p-3"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[178/100] w-[178px] shrink-0 overflow-hidden rounded-xl bg-cine-800">
                      {item.work.thumbnail_image_url ? (
                        <Image
                          src={item.work.thumbnail_image_url}
                          alt={item.work.title}
                          fill
                          sizes="178px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cine-700 to-cine-950">
                          <span className="text-[10px] text-cine-300">
                            Frame
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center gap-1.5 min-w-0">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                        {String(index + 1).padStart(2, "0")} ·{" "}
                        {item.section_label ?? "OBRA"}
                      </span>

                      <h3 className="font-heading text-xl font-bold leading-snug tracking-tight text-cine-50 truncate">
                        {item.work.title}
                      </h3>

                      {item.admin_comment && (
                        <p className="text-xs leading-relaxed text-cine-200 line-clamp-2">
                          {item.admin_comment}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="flex items-center rounded-full bg-cine-yellow px-2 py-0.5 text-[10px] font-extrabold text-cine-text-dark">
                          {item.work.rating}
                        </span>
                        <span className="text-[11px] text-cine-300">
                          {typeLabels[item.work.type] ?? item.work.type}
                          {item.work.duration_minutes
                            ? ` · ${item.work.duration_minutes} min`
                            : ""}
                        </span>
                      </div>

                      <Link
                        href={`/obras/${item.work.slug}`}
                        className="inline-flex min-h-[32px] items-center rounded-full border border-cine-50/20 px-3 text-[11px] font-bold text-cine-50 transition-colors hover:bg-cine-yellow hover:text-cine-text-dark hover:border-cine-yellow self-start mt-1"
                      >
                        Abrir obra
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-cine-300">
                Nenhuma obra adicionada a esta lista ainda.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* Curatorial Summary */}
          <div className="flex flex-col gap-3.5 rounded-[18px] border border-cine-300/40 bg-cine-800/40 p-5">
            <h2 className="font-heading text-[21px] font-bold leading-tight tracking-tight text-cine-50">
              Resumo da curadoria
            </h2>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "ETAPA", value: list.stage ?? "—" },
                {
                  label: "DURAÇÃO ESTIMADA",
                  value: list.estimated_duration_minutes
                    ? `${list.estimated_duration_minutes} min`
                    : "—",
                },
                {
                  label: "OBRAS",
                  value: `${items.length} ${items.length === 1 ? "obra" : "obras"}`,
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
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Themes */}
          {list.themes && list.themes.length > 0 && (
            <div className="flex flex-col gap-3.5 rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
              <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
                Temas principais
              </h2>
              <div className="flex flex-wrap gap-2">
                {list.themes.map((theme) => (
                  <span
                    key={theme.id}
                    className="inline-flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50"
                  >
                    {theme.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BNCC */}
          {list.bncc_skills && list.bncc_skills.length > 0 && (
            <div className="flex flex-col gap-3.5 rounded-[18px] border border-cine-border bg-cine-card-alt p-6">
              <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
                BNCC
              </h2>
              <div className="flex flex-col gap-2.5">
                {list.bncc_skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex flex-col gap-1 rounded-xl border border-cine-border/70 bg-cine-900/35 p-3"
                  >
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-cine-yellow-light">
                      {skill.code}
                    </span>
                    <p className="text-xs leading-relaxed text-cine-200">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
