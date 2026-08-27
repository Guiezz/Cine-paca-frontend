"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { BnccSkillEntity } from "@/types/api";
import { adminButton, adminInput, adminLabel, adminTextarea } from "@/components/admin/form-controls";

export default function AdminBnccNovaPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [stage, setStage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = adminInput();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await clientApi.post<BnccSkillEntity>("/api/admin/bncc-skills", {
      code,
      description,
      area,
      stage,
    });
    if (res.ok) {
      router.push("/admin/bncc");
    } else {
      setError(res.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-[18px] pt-4">
      <div className="flex flex-col gap-[11.4px]">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-[28px] bg-cine-yellow" />
          <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
            TAXONOMIA
          </span>
        </div>
        <h1 className="font-heading text-3xl md:text-5xl lg:text-[58px] font-bold leading-tight lg:leading-[59.74px] tracking-tight lg:tracking-[-1.74px] text-cine-50">
          Nova habilidade BNCC
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className={adminLabel()}>
            Código
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex: EF15LP01"
            className={inputClass}
          />
        </div>

        <div>
          <label className={adminLabel()}>
            Área
          </label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Ex: Linguagens"
            className={inputClass}
          />
        </div>

        <div>
          <label className={adminLabel()}>
            Etapa
          </label>
          <input
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="Ex: Ensino Fundamental - Anos Iniciais"
            className={inputClass}
          />
        </div>

        <div>
          <label className={adminLabel()}>
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva a habilidade..."
            className={adminTextarea({ size: "md" })}
          />
        </div>

        {error && (
          <div className="rounded-[10px] border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/bncc")}
            className={adminButton({ variant: "secondary" })}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !code.trim() || !description.trim()}
            className={adminButton({ variant: "primary" })}
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
