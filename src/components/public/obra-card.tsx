import Image from "next/image";
import Link from "next/link";
import type { WorkEntity } from "@/types/api";
import { cn } from "@/lib/utils";

interface ObraCardProps {
  work: WorkEntity;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function ObraCard({ work, variant = "default", className }: ObraCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-cine-border",
        isFeatured ? "bg-cine-50" : "bg-cine-card",
        className,
      )}
    >
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-cine-900">
              <path
                d="M8 5v14l11-7L8 5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>

      <div className={cn(
        "flex flex-col gap-2",
        isFeatured ? "p-4" : "p-4",
      )}>
        <h3 className={cn(
          "font-heading font-bold text-cine-text-dark",
          isFeatured ? "text-2xl leading-tight" : isCompact ? "text-lg leading-snug" : "text-xl leading-snug",
          !isFeatured && "text-cine-50",
        )}>
          {work.title}
        </h3>

        <p className={cn(
          "text-xs",
          isFeatured ? "text-cine-text-dark/70" : "text-cine-200/70",
        )}>
          {[
            work.release_year,
            work.type === "short_film" ? "Curta" : work.type === "feature_film" ? "Longa" : "Documentário",
            work.rating,
            `${work.duration_minutes} min`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {!isCompact && work.short_description && (
          <p className={cn(
            "text-sm leading-relaxed",
            isFeatured ? "text-cine-text-dark/75" : "text-cine-50/75",
          )}>
            {work.short_description}
          </p>
        )}

        {work.themes && work.themes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {work.themes.slice(0, 3).map((theme) => (
              <span
                key={theme.id}
                className="flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-cine-50"
              >
                {theme.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={work.external_video_url ?? "#"}
            className={cn(
              "flex min-h-[38px] items-center rounded-full px-3.5 text-xs font-bold transition-colors",
              isFeatured
                ? "bg-cine-yellow text-cine-text-dark hover:bg-cine-yellow-light"
                : "bg-cine-yellow text-cine-text-dark hover:bg-cine-yellow-light",
            )}
            target={work.external_video_url ? "_blank" : undefined}
          >
            {isFeatured ? "Ver detalhes" : "Assistir"}
          </Link>
          <Link
            href={`/obras/${work.slug}`}
            className={cn(
              "flex min-h-[38px] items-center rounded-full border px-3.5 text-xs font-bold transition-colors",
              isFeatured
                ? "border-cine-text-dark/20 text-cine-text-dark hover:bg-cine-text-dark/5"
                : "border-cine-50/20 text-cine-50 hover:bg-cine-50/5",
            )}
          >
            {isFeatured ? "Adicionar" : "Mais informações"}
          </Link>
        </div>
      </div>
    </article>
  );
}
