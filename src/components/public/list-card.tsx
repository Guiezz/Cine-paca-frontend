import Image from "next/image";
import Link from "next/link";
import type { ListEntity } from "@/types/api";

interface ListCardProps {
  list: ListEntity;
  variant?: "default" | "compact";
}

export function ListCard({ list, variant = "default" }: ListCardProps) {
  const count = list.items?.length ?? 0;
  const thumbnail = list.items?.find((i) => i.work.thumbnail_image_url)?.work.thumbnail_image_url;
  const hasCover = !!(list.cover_image_url ?? thumbnail);

  return (
    <Link
      href={`/curadorias/${list.slug}`}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-cine-border bg-cine-card transition-colors hover:border-cine-300/60"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-cine-800">
        {list.cover_image_url ? (
          <Image
            src={list.cover_image_url}
            alt={list.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : thumbnail ? (
          <Image
            src={thumbnail}
            alt={list.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cine-700 to-cine-950">
            <span className="text-sm text-cine-300">Em breve</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(29,17,48,0.6)] to-transparent" />
        {count > 0 && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-cine-yellow px-2.5 py-1 text-xs font-extrabold text-cine-text-dark">
            {count} {count === 1 ? "obra" : "obras"}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-heading text-xl font-bold leading-snug tracking-tight text-cine-50 group-hover:text-cine-yellow">
          {list.title}
        </h3>

        <p className="text-sm leading-relaxed text-cine-200 line-clamp-2">
          {list.description}
        </p>

        {(list.stage || (list.themes && list.themes.length > 0)) && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {list.stage && (
              <span className="inline-flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-cine-50">
                {list.stage}
              </span>
            )}
            {list.themes?.slice(0, 2).map((theme) => (
              <span
                key={theme.id}
                className="inline-flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-cine-50"
              >
                {theme.name}
              </span>
            ))}
          </div>
        )}

        <div className="pt-1">
          <span className="inline-flex min-h-[38px] items-center rounded-full border border-cine-50/20 px-3.5 text-xs font-bold text-cine-50 transition-colors group-hover:bg-cine-yellow group-hover:text-cine-text-dark group-hover:border-cine-yellow">
            Abrir lista
          </span>
        </div>
      </div>
    </Link>
  );
}
