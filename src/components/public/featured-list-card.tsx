import Image from "next/image";
import Link from "next/link";
import type { ListEntity } from "@/types/api";

interface FeaturedListCardProps {
  list: ListEntity;
}

export function FeaturedListCard({ list }: FeaturedListCardProps) {
  const thumbnails = list.items
    ?.map((i) => i.work.thumbnail_image_url)
    .filter(Boolean) as string[];
  const displayThumbnails = thumbnails.slice(0, 4);
  const count = list.items?.length ?? 0;

  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-[1fr_1fr] overflow-hidden rounded-[22px] border border-cine-border bg-cine-card">
      {/* Mosaic */}
      <div className="relative grid min-h-[320px] grid-cols-2 overflow-hidden">
        {displayThumbnails.length > 0 ? (
          displayThumbnails.map((url, i) => (
            <div
              key={i}
              className={`relative overflow-hidden ${i === 0 && displayThumbnails.length === 1 ? "col-span-2" : ""}`}
              style={
                displayThumbnails.length >= 3
                  ? { transform: "rotate(-2deg)", scale: 1.05 }
                  : undefined
              }
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <>
            <div className="h-full bg-cine-800" />
            <div className="h-full bg-cine-800" />
          </>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(29,17,48,0.7)] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-4 px-5 py-8 md:px-8 md:py-10">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-7 bg-cine-yellow" />
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-cine-yellow-light">
            LISTA EM DESTAQUE
          </span>
        </div>

        <h2 className="font-heading text-2xl md:text-[34px] font-bold leading-[1.1] tracking-tight text-cine-50">
          {list.title}
        </h2>

        <p className="text-sm leading-relaxed text-cine-200 line-clamp-3">
          {list.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {list.stage && (
            <span className="inline-flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50">
              {list.stage}
            </span>
          )}
          {list.themes?.slice(0, 3).map((theme) => (
            <span
              key={theme.id}
              className="inline-flex items-center rounded-full border border-cine-300/40 bg-cine-300/20 px-2.5 py-1 text-xs font-bold text-cine-50"
            >
              {theme.name}
            </span>
          ))}
          <span className="inline-flex items-center rounded-full bg-cine-yellow px-2.5 py-1 text-xs font-bold text-cine-text-dark">
            {count} {count === 1 ? "obra" : "obras"}
          </span>
        </div>

        <div className="pt-2">
          <Link
            href={`/curadorias/${list.slug}`}
            className="inline-flex min-h-[42px] items-center rounded-full bg-cine-yellow px-5 text-sm font-bold text-cine-text-dark transition-colors hover:bg-cine-yellow-light"
          >
            Abrir lista
          </Link>
        </div>
      </div>
    </section>
  );
}
