"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Rótulos precisam ir como `items`: o <SelectValue> do Base UI só mapeia
 * valor para rótulo com essa tabela, senão mostra o valor cru.
 */
const SORT_LABELS: Record<string, string> = {
  relevance: "Ordenar por relevância",
  title: "Ordenar por título",
};

export function SearchSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "relevance";

  function handleSortChange(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    const newSort = value ?? "relevance";

    if (newSort === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select items={SORT_LABELS} value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger
        aria-label="Ordenar resultados"
        className="min-h-[40px] w-full rounded-full border border-cine-border bg-[rgba(42,26,69,0.66)] px-3.5 text-sm font-[560] text-cine-200 outline-none transition-colors focus-visible:border-cine-yellow focus-visible:ring-2 focus-visible:ring-cine-yellow/25 sm:w-auto"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
