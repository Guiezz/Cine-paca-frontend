"use client";

import { WorkForm } from "@/components/admin/work-form";

export default function AdminObraNovaPage() {
  return (
    <div className="space-y-[18px]">
      <div className="flex flex-col gap-[11.4px] pt-4">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-[28px] bg-cine-yellow" />
          <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
            GESTÃO DO ACERVO
          </span>
        </div>
        <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
          Cadastrar filme ou curta
        </h1>
        <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
          Preencha os dados da obra e revise o checklist antes de publicar. Você pode salvar como
          rascunho e retomar depois.
        </p>
      </div>

      <WorkForm />
    </div>
  );
}
