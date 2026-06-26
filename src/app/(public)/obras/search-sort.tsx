"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChangeEvent } from "react";

export function SearchSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "relevance";

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const newSort = e.target.value;

    if (newSort === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex min-h-[40px] items-center rounded-full border border-cine-border bg-[rgba(42,26,69,0.66)] px-3.5 text-sm font-[560] text-cine-200">
      <select 
        className="bg-transparent outline-none cursor-pointer"
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value="relevance">Ordenar por relevância</option>
        <option value="title">Ordenar por título</option>
        {/* <option value="newest">Mais recentes</option>
        <option value="oldest">Mais antigos</option> */}
      </select>
    </div>
  );
}