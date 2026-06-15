"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { clientApi } from "@/lib/api-client";
import type { ListEntity } from "@/types/api";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminListaDetailPage() {
  const params = useParams();
  const [list, setList] = useState<ListEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi.get<ListEntity>(`/api/admin/lists/${params.id}`).then((res) => {
      if (res.ok) setList(res.data);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-6 animate-spin rounded-full border-2 border-cine-yellow border-t-transparent" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm text-cine-200">Lista não encontrada.</p>
        <Link href="/admin/listas" className="text-sm text-cine-yellow hover:underline">
          Voltar para listas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-[28px] bg-cine-yellow" />
            <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
              CURADORIA
            </span>
          </div>
          <h1 className="mt-2 font-heading text-[42px] font-bold tracking-[-1.26px] text-cine-50">
            {list.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={list.status} />
          <Link
            href={`/admin/listas/${list.id}/editar`}
            className="inline-flex h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-4 text-[13px] font-[650] text-cine-50 transition-colors hover:bg-cine-50/10"
          >
            Editar
          </Link>
        </div>
      </div>

      <p className="max-w-2xl text-base leading-[24.8px] text-cine-200">{list.description}</p>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4">
          <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
            <h2 className="font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
              Obras na lista
            </h2>
            {list.items && list.items.length > 0 ? (
              <div className="mt-4 space-y-2">
                {list.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-[10px] border border-[rgba(80,64,107,0.4)] bg-[rgba(29,17,48,0.42)] px-4 py-3"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cine-purple/30 text-xs font-bold text-cine-300">
                      {item.position}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-cine-50 truncate">
                        {item.work.title}
                      </p>
                      {item.section_label && (
                        <p className="text-xs text-cine-300">{item.section_label}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-[11px] text-cine-300">
                      {item.work.duration_minutes} min
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-cine-300">Nenhuma obra adicionada.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {list.stage && (
            <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                Etapa sugerida
              </span>
              <p className="mt-2 text-sm text-cine-50">{list.stage}</p>
            </div>
          )}
          {list.themes && list.themes.length > 0 && (
            <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                Temas
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {list.themes.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full border border-[rgba(170,147,249,0.34)] bg-[rgba(170,147,249,0.12)] px-3 py-1.5 text-sm text-cine-50"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              Criada em
            </span>
            <p className="mt-2 text-sm text-cine-200">
              {new Date(list.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
