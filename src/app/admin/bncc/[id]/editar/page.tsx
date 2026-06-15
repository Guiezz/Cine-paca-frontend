"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { BnccSkillEntity } from "@/types/api";

export default function AdminBnccEditarPage() {
  const router = useRouter();
  const params = useParams();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "h-[44px] w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow";

  useEffect(() => {
    clientApi.get<BnccSkillEntity>(`/api/admin/bncc-skills/${params.id}`).then((res) => {
      if (res.ok) {
        setCode(res.data.code);
        setDescription(res.data.description);
        setArea(res.data.area);
        setStage(res.data.stage);
      }
      setLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await clientApi.patch<BnccSkillEntity>(
      `/api/admin/bncc-skills/${params.id}`,
      { code, description, area, stage },
    );
    if (res.ok) {
      router.push("/admin/bncc");
    } else {
      setError(res.error);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-6 animate-spin rounded-full border-2 border-cine-yellow border-t-transparent" />
      </div>
    );
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
        <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
          Editar habilidade BNCC
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Código
          </label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Área
          </label>
          <input value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Etapa
          </label>
          <input value={stage} onChange={(e) => setStage(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-[100px] w-full resize-none rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 py-2 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
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
            className="inline-flex h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-5 text-sm font-[650] text-cine-50 transition-colors hover:bg-cine-50/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !code.trim() || !description.trim()}
            className="inline-flex h-[42px] items-center rounded-full bg-cine-yellow px-5 text-sm font-[650] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
