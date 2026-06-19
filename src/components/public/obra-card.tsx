import Image from "next/image";
import Link from "next/link";
import type { WorkEntity } from "@/types/api";
import { cn } from "@/lib/utils";

interface ObraCardProps {
  work: WorkEntity;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function ObraCard({
  work,
  variant = "default",
  className,
}: ObraCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const detailHref = `/obras/${work.slug}`;

  const thumbnail = (
    <div className="relative aspect-video w-full overflow-hidden bg-cine-800">
      {work.thumbnail_image_url ? (
        <Image
          src={work.thumbnail_image_url}
          alt={work.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cine-700 to-cine-950 p-4">
          <span className="text-sm text-cine-200">Frame de {work.title}</span>
        </div>
      )}

      <div className="absolute left-3 top-3 flex items-center rounded-lg bg-cine-yellow px-2.5 py-1.5 text-xs font-extrabold text-cine-text-dark">
        {work.rating}
      </div>

      {work.external_video_url && (
        <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-cine-50/90">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-cine-900"
          >
            <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );

  const metadata = (
    <p
      className={cn(
        "text-xs",
        isFeatured ? "text-cine-text-dark/70" : "text-cine-200/70",
      )}
    >
      {[
        work.release_year,
        work.type === "short"
          ? "Curta"
          : work.type === "documentary"
            ? "Doc"
            : work.type === "animation"
              ? "Animação"
              : work.type,
        work.rating,
        `${work.duration_minutes} min`,
      ]
        .filter(Boolean)
        .join(" · ")}
    </p>
  );

  const themes = work.themes && work.themes.length > 0 && (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {work.themes.slice(0, 3).map((theme) => (
        <span
          key={theme.id}
          className={cn(
            "flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
            isFeatured
              ? "border border-[#CABFFE] bg-[#E9E5FF] text-[#181226]"
              : "border border-cine-300/40 bg-cine-300/20 text-cine-50",
          )}
        >
          {theme.name}
        </span>
      ))}
    </div>
  );

  if (isCompact) {
    return (
      <Link href={detailHref} className={cn("block h-full rounded-2xl", className)}>
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-cine-border bg-cine-card">
          <div className="shrink-0">{thumbnail}</div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
            <h3 className="line-clamp-2 font-heading text-lg font-bold leading-snug text-cine-50">
              {work.title}
            </h3>
            {metadata}
            {themes && <div className="mt-auto">{themes}</div>}
          </div>
        </article>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-cine-border",
        isFeatured ? "bg-cine-50" : "bg-cine-card",
        className,
      )}
    >
      <Link href={detailHref}>{thumbnail}</Link>

      <div className={cn("flex flex-col gap-2", isFeatured ? "p-4" : "p-4")}>
        <h3
          className={cn(
            "font-heading font-bold",
            isFeatured
              ? "text-2xl leading-tight text-cine-text-dark"
              : "text-xl leading-snug text-cine-50",
          )}
        >
          {work.title}
        </h3>

        {metadata}

        {(work.short_description || work.synopsis) && (
          <p
            className={cn(
              "text-sm leading-relaxed",
              isFeatured ? "text-cine-text-dark/75" : "text-cine-50/75",
            )}
          >
            {work.short_description || work.synopsis}
          </p>
        )}

        {themes}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {work.external_video_url && (
            <Link
              href={work.external_video_url}
              className="flex min-h-[38px] items-center rounded-full bg-cine-yellow px-3.5 text-xs font-bold text-cine-text-dark transition-colors hover:bg-cine-yellow-light"
              target="_blank"
            >
              Assistir
            </Link>
          )}
          <Link
            href={detailHref}
            className={cn(
              "flex min-h-[38px] items-center rounded-full border px-3.5 text-xs font-bold transition-colors",
              isFeatured
                ? "border-cine-text-dark/20 text-cine-text-dark hover:bg-cine-text-dark/5"
                : "border-cine-50/20 text-cine-50 hover:bg-cine-50/5",
            )}
          >
            {isFeatured ? "Ver detalhes" : "Mais informações"}
          </Link>
        </div>
      </div>
    </article>
  );
}
