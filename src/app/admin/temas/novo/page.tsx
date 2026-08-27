"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { ThemeEntity } from "@/types/api";
import { adminButton, adminInput, adminLabel } from "@/components/admin/form-controls";

export default function AdminTemaNovoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await clientApi.post<ThemeEntity>("/api/admin/themes", { name });
    if (res.ok) {
      router.push("/admin/temas");
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
          Novo tema
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className={adminLabel()}>
            Nome
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Emoções"
            className={`mt-1 ${adminInput()}`}
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
            onClick={() => router.push("/admin/temas")}
            className={adminButton({ variant: "secondary" })}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className={adminButton({ variant: "primary" })}
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
