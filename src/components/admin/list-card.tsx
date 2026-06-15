"use client";

import Link from "next/link";
import Image from "next/image";
import type { ListEntity } from "@/types/api";

const statusConfig: Record<string, { label: string; color: string }> = {
  published: { label: "PUBLICADA", color: "text-cine-yellow-light" },
  draft: { label: "REVISÃO", color: "text-cine-300" },
  archived: { label: "ARQUIVADA", color: "text-cine-200" },
};

export function ListCard({ list }: { list: ListEntity }) {
  const status = statusConfig[list.status] ?? { label: "REVISÃO", color: "text-cine-300" };
  const count = list.items?.length ?? 0;
  const thumbnails = list.items?.slice(0, 2).map((i) => i.work.thumbnail_image_url).filter(Boolean) ?? [];

  return (
    <div className="overflow-hidden rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337]">
      <div className="relative grid min-h-[174px] grid-cols-2 overflow-hidden">
        {thumbnails.length > 0 ? (
          <>
            {thumbnails[0] && (
              <Image src={thumbnails[0]} alt="" width={190} height={174} className="h-[174px] w-full object-cover" />
            )}
            {thumbnails[1] ? (
              <Image src={thumbnails[1]} alt="" width={190} height={174} className="h-[174px] w-full object-cover" />
            ) : (
              <div className="h-[174px] bg-cine-800" />
            )}
          </>
        ) : (
          <>
            <div className="h-[174px] bg-cine-800" />
            <div className="h-[174px] bg-cine-800" />
          </>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(29,17,48,0.82)] to-transparent" />
      </div>

      <div className="px-[18px] pb-[18px] pt-[23px]">
        <div className={`font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${status.color}`}>
          {status.label} · {count} {count === 1 ? "OBRA" : "OBRAS"}
        </div>

        <h2 className="mt-1 font-heading text-[22px] font-bold leading-[24.64px] tracking-[-0.44px] text-cine-50">
          {list.title}
        </h2>

        <p className="mt-[7px] text-[13px] leading-[18.85px] text-cine-200 line-clamp-2">
          {list.description}
        </p>

        {(list.stage || (list.bncc_skills && list.bncc_skills.length > 0)) && (
          <div className="mt-[14px] flex flex-wrap gap-[7px]">
            {list.stage && (
              <span className="inline-flex min-h-[26px] items-center rounded-full border border-[rgba(170,147,249,0.40)] bg-[rgba(170,147,249,0.22)] px-[9px] text-[11px] font-[650] uppercase tracking-[0.03em] text-cine-50">
                {list.stage}
              </span>
            )}
            {list.bncc_skills?.slice(0, 2).map((s) => (
              <span
                key={s.id}
                className="inline-flex min-h-[26px] items-center rounded-full border border-[rgba(170,147,249,0.40)] bg-[rgba(170,147,249,0.22)] px-[9px] text-[11px] font-[650] uppercase tracking-[0.03em] text-cine-50"
              >
                BNCC {s.area}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Link
            href={`/admin/listas/${list.id}`}
            className={`inline-flex min-h-[42px] flex-1 items-center justify-center rounded-full text-[13px] font-[650] tracking-[0.01em] transition-colors ${
              list.status === "published"
                ? "bg-cine-yellow text-cine-text-dark hover:bg-cine-yellow-dark"
                : "border border-[rgba(248,245,239,0.22)] text-cine-50 hover:bg-cine-50/10"
            }`}
          >
            {list.status === "published" ? "Ver lista" : list.status === "draft" ? "Revisar" : "Continuar edição"}
          </Link>
          <Link
            href={`/admin/listas/${list.id}/editar`}
            className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-full border border-[rgba(248,245,239,0.22)] text-[13px] font-[650] tracking-[0.01em] text-cine-50 transition-colors hover:bg-cine-50/10"
          >
            {list.status === "published" ? "Editar" : list.status === "draft" ? "Prévia" : "Prévia"}
          </Link>
        </div>
      </div>
    </div>
  );
}
