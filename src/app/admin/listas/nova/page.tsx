"use client";

import { ListForm } from "@/components/admin/list-form";

export default function AdminListaNovaPage() {
  return (
    <div className="space-y-[22px] pt-4">
      <div className="flex flex-col gap-[11.4px]">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-[28px] bg-cine-yellow" />
          <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
            CURADORIA EDITORIAL
          </span>
        </div>
        <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
          Criar lista de filmes
        </h1>
        <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
          Monte uma sequência de obras para uso em sala, com recorte pedagógico, ordem sugerida e
          explicação clara para professores.
        </p>
      </div>

      <ListForm />
    </div>
  );
}
