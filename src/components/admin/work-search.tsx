"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { clientApi } from "@/lib/api-client";
import type { WorkEntity, PaginatedResponse } from "@/types/api";
import { Search } from "lucide-react";

const typeLabels: Record<string, string> = {
  short_film: "Curta",
  feature_film: "Longa",
  documentary: "Documentário",
  animation: "Animação",
  series: "Série",
};

interface WorkSearchProps {
  onAdd: (work: WorkEntity) => void;
  addedIds: Set<string>;
}

export function WorkSearch({ onAdd, addedIds }: WorkSearchProps) {
  const [allWorks, setAllWorks] = useState<WorkEntity[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi
      .get<PaginatedResponse<WorkEntity>>("/api/admin/works", { params: { per_page: 50 } })
      .then((res) => {
        if (res.ok) setAllWorks(res.data.data);
        setLoading(false);
      });
  }, []);

  const filtered = query.trim()
    ? allWorks.filter(
        (w) =>
          w.title.toLowerCase().includes(query.toLowerCase()) ||
          (w.themes && w.themes.some((t) => t.name.toLowerCase().includes(query.toLowerCase()))),
      )
    : allWorks;

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cine-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar obras por título ou tema..."
          className="h-[44px] w-full rounded-[12px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] pl-9 pr-3 text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
        />
      </div>

      {loading ? (
        <div className="mt-4 flex justify-center">
          <div className="size-5 animate-spin rounded-full border-2 border-cine-yellow border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-4 text-sm text-cine-300">
          {query ? `Nenhuma obra encontrada para "${query}".` : "Nenhuma obra cadastrada."}
        </p>
      ) : (
        <div className="mt-3 max-h-[400px] space-y-3 overflow-y-auto pr-1">
          {filtered.map((work) => {
            const alreadyAdded = addedIds.has(work.id);
            return (
              <div
                key={work.id}
                className="grid grid-cols-[120px_1fr_auto] gap-3 rounded-[14px] border border-[rgba(80,64,107,0.70)] bg-[rgba(29,17,48,0.34)] p-3"
              >
                <div className="h-[80px] w-[120px] shrink-0 overflow-hidden rounded-[10px] bg-cine-800">
                  {work.thumbnail_image_url ? (
                    <Image
                      src={work.thumbnail_image_url}
                      alt=""
                      width={120}
                      height={80}
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
                    {typeLabels[work.type] ?? work.type} ·{" "}
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
        </div>
      )}
    </div>
  );
}
