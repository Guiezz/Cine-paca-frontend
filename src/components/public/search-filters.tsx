"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface FilterGroup {
  label: string;
  param: string;
  options: { value: string; label: string }[];
}

const filterGroups: FilterGroup[] = [
  {
    label: "ETAPA",
    param: "stage",
    options: [
      { value: "Anos iniciais", label: "Anos iniciais" },
      { value: "Ensino Fundamental", label: "Ensino Fundamental" },
      { value: "Educação Infantil", label: "Educação Infantil" },
    ],
  },
  {
    label: "TIPO DE OBRA",
    param: "type",
    options: [
      { value: "short", label: "Curta-metragem" },
      { value: "animation", label: "Animação" },
      { value: "documentary", label: "Documentário" },
    ],
  },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (param: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      if (checked) {
        params.set(param, value);
      } else {
        params.delete(param);
      }
      params.delete("page");
      router.push(`/obras?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <aside className="flex flex-col self-start rounded-[18px] border border-cine-border bg-cine-card-alt p-5 w-[270px]">
      <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight text-cine-50">
        Refinar por aula
      </h2>
      <p className="pt-2 text-sm leading-relaxed text-cine-200">
        Use os critérios pedagógicos para encontrar obras adequadas ao planejamento.
      </p>

      {filterGroups.map((group) => (
        <fieldset key={group.param} className="flex flex-col gap-2 pt-5">
          <legend className="flex items-center gap-2.5 w-full pb-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-cine-yellow-light">
              {group.label}
            </span>
            <div className="h-px flex-1 bg-cine-border" />
          </legend>

          {group.options.map((option) => {
            const isActive = searchParams.get(group.param) === option.value;
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 text-sm text-cine-200"
              >
                <div
                  onClick={() => updateParam(group.param, option.value, !isActive)}
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[2.5px] transition-colors",
                    isActive ? "bg-cine-yellow" : "border border-[#767676] bg-white",
                  )}
                >
                  {isActive && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className="text-cine-text-dark"
                    >
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                {option.label}
              </label>
            );
          })}
        </fieldset>
      ))}

      {/* Empty state tip */}
      <div className="mt-6 rounded-2xl border border-cine-300/40 bg-cine-800/40 p-5">
        <h3 className="font-heading text-base font-bold text-cine-50">
          Experimente buscar por tema
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-cine-200">
          Termos como infância, território, memória, natureza ou animação tendem a
          encontrar mais obras do acervo.
        </p>
      </div>
    </aside>
  );
}
