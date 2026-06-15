"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Filter {
  label: string;
  param: string;
  value: string;
}

export function SearchActiveFilters({
  hasActiveFilters,
  filters,
}: {
  hasActiveFilters: boolean;
  filters: Filter[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function removeFilter(param: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(param);
    router.push(`/obras?${params.toString()}`);
  }

  function clearAll() {
    router.push("/obras");
  }

  if (!hasActiveFilters) return null;

  return (
    <section className="flex w-full items-center gap-5 rounded-[18px] border border-cine-border bg-[rgba(42,26,69,0.82)] px-4 py-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-cine-yellow-light whitespace-nowrap">
        FILTROS ATIVOS
      </span>

      <div className="flex items-center gap-2.5">
        {filters.map((filter) => (
          <div
            key={filter.param}
            className="flex min-h-[38px] items-center gap-2 rounded-full border border-cine-300 bg-cine-600 px-3.5 text-sm font-[560] text-cine-50"
          >
            <span>{filter.value}</span>
            <button
              onClick={() => removeFilter(filter.param)}
              className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-cine-50/15 text-xs font-[560] text-cine-50 hover:bg-cine-50/30"
            >
              ×
            </button>
          </div>
        ))}

        {searchParams.get("q") && (
          <div className="flex min-h-[38px] items-center gap-2 rounded-full border border-cine-300 bg-cine-600 px-3.5 text-sm font-[560] text-cine-50">
            <span>Busca: {searchParams.get("q")}</span>
            <button
              onClick={() => removeFilter("q")}
              className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-cine-50/15 text-xs font-[560] text-cine-50 hover:bg-cine-50/30"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <button
        onClick={clearAll}
        className="ml-auto whitespace-nowrap text-sm font-bold text-cine-yellow-light hover:underline"
      >
        Limpar filtros
      </button>
    </section>
  );
}
