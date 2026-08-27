"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { clientApi } from "@/lib/api-client";
import type { WorkEntity, PaginatedResponse } from "@/types/api";
import { Search } from "lucide-react";
import { WORK_TYPE_LABELS_SHORT } from "@/lib/labels";

interface WorkSearchProps {
  onAdd: (work: WorkEntity) => void;
  addedIds: Set<string>;
}

const PER_PAGE = 20;

export function WorkSearch({ onAdd, addedIds }: WorkSearchProps) {
  const [works, setWorks] = useState<WorkEntity[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Antes isto carregava 50 obras uma única vez e filtrava no cliente: acima
  // de 50 cadastros, buscar uma obra existente devolvia "nenhuma encontrada".
  // Agora a busca vai para a API, com debounce para não disparar por tecla.
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      const params: Record<string, string | number> = { per_page: PER_PAGE };
      const trimmed = query.trim();
      if (trimmed) params.q = trimmed;

      const res = await clientApi.get<PaginatedResponse<WorkEntity>>(
        "/api/admin/works",
        { params },
      );
      if (cancelled) return;

      if (res.ok) {
        setWorks(res.data.data);
        setTotalItems(res.data.pagination.total_items);
        setError(null);
      } else {
        setWorks([]);
        setTotalItems(0);
        setError(res.error);
      }
      setLoading(false);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const hiddenCount = Math.max(0, totalItems - works.length);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cine-300" />
        <input
          id="lista-busca-obras"
          // Dentro de um <form>, Enter aqui submeteria a lista inteira.
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar obras por título..."
          className="h-[44px] w-full rounded-[12px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] pl-9 pr-3 text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
        />
      </div>

      {loading ? (
        <div className="mt-4 flex justify-center">
          <div className="size-5 animate-spin rounded-full border-2 border-cine-yellow border-t-transparent" />
        </div>
      ) : error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          Não foi possível carregar as obras: {error}
        </p>
      ) : works.length === 0 ? (
        <p className="mt-4 text-sm text-cine-300">
          {query ? `Nenhuma obra encontrada para "${query}".` : "Nenhuma obra cadastrada."}
        </p>
      ) : (
        <div className="mt-3 max-h-[400px] space-y-3 overflow-y-auto pr-1">
          {works.map((work) => {
            const alreadyAdded = addedIds.has(work.id);
            return (
              <div
                key={work.id}
                className="grid grid-cols-[120px_1fr_auto] gap-3 rounded-[14px] border border-[rgba(80,64,107,0.70)] bg-[rgba(29,17,48,0.34)] p-3"
              >
                <div className="aspect-video w-[120px] shrink-0 overflow-hidden rounded-[10px] bg-cine-800">
                  {work.thumbnail_image_url ? (
                    <Image
                      src={work.thumbnail_image_url}
                      alt=""
                      width={120}
                      height={68}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-cine-300">
                      sem img
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-col justify-center gap-1.5">
                  <h3 className="truncate font-heading text-[17px] font-bold leading-[19.72px] tracking-[-0.17px] text-cine-50">
                    {work.title}
                  </h3>
                  <p className="truncate text-[13px] leading-[18.85px] text-cine-200">
                    {WORK_TYPE_LABELS_SHORT[work.type] ?? work.type} ·{" "}
                    {work.rating === "L" ? "Livre" : `${work.rating}+`}
                    {work.themes && work.themes.length > 0 && ` · ${work.themes.map((t) => t.name).join(" · ")}`}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => onAdd(work)}
                  className="inline-flex h-[42px] shrink-0 items-center rounded-full border border-[rgba(248,245,239,0.22)] px-4 text-[13px] font-[650] text-cine-50 transition-colors hover:bg-cine-50/10 disabled:opacity-40"
                >
                  {alreadyAdded ? "Adicionado" : "Adicionar"}
                </button>
              </div>
            );
          })}

          {hiddenCount > 0 && (
            <p className="pt-1 text-center text-xs text-cine-300">
              Mostrando {works.length} de {totalItems} obras. Refine a busca para
              encontrar as demais.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
