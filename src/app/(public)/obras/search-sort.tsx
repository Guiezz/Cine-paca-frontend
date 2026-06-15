"use client";

export function SearchSort() {
  return (
    <div className="flex min-h-[40px] items-center rounded-full border border-cine-border bg-[rgba(42,26,69,0.66)] px-3.5 text-sm font-[560] text-cine-200">
      <select className="bg-transparent outline-none cursor-pointer">
        <option value="relevance">Ordenar por relevância</option>
        <option value="title">Ordenar por título</option>
        <option value="newest">Mais recentes</option>
        <option value="oldest">Mais antigos</option>
      </select>
    </div>
  );
}
