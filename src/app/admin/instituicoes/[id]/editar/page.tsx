"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { InstitutionEntity, InstitutionType } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminInstituicaoEditarPage() {
  const router = useRouter();
  const params = useParams();
  const [name, setName] = useState("");
  const [type, setType] = useState<InstitutionType>("school");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "h-[44px] w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow";
  const selectClass =
    "h-[44px] rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50";

  useEffect(() => {
    clientApi.get<InstitutionEntity>(`/api/admin/institutions/${params.id}`).then((res) => {
      if (res.ok) {
        setName(res.data.name);
        setType(res.data.type);
        setWebsiteUrl(res.data.website_url ?? "");
      }
      setLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await clientApi.patch<InstitutionEntity>(
      `/api/admin/institutions/${params.id}`,
      { name, type, website_url: websiteUrl || undefined },
    );
    if (res.ok) {
      router.push("/admin/instituicoes");
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
          Editar instituição
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Nome
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Tipo
          </label>
          <Select value={type} onValueChange={(v) => setType((v ?? "school") as InstitutionType)}>
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="school">Escola</SelectItem>
              <SelectItem value="university">Universidade</SelectItem>
              <SelectItem value="cultural_center">Centro Cultural</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Website
          </label>
          <input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
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
            onClick={() => router.push("/admin/instituicoes")}
            className="inline-flex h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-5 text-sm font-[650] text-cine-50 transition-colors hover:bg-cine-50/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="inline-flex h-[42px] items-center rounded-full bg-cine-yellow px-5 text-sm font-[650] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
