"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { clientApi } from "@/lib/api-client";
import type { WorkEntity } from "@/types/api";
import { StatusBadge } from "@/components/admin/status-badge";

const typeLabels: Record<string, string> = {
  short: "Curta-metragem",
  documentary: "Documentário",
  animation: "Animação",
};

const statusActions: Record<string, { label: string; endpoint: string; variant: string }[]> = {
  draft: [
    { label: "Publicar", endpoint: "publish", variant: "primary" },
    { label: "Arquivar", endpoint: "archive", variant: "danger" },
  ],
  published: [
    { label: "Despublicar", endpoint: "unpublish", variant: "secondary" },
    { label: "Arquivar", endpoint: "archive", variant: "danger" },
  ],
  archived: [
    { label: "Recuperar", endpoint: "unpublish", variant: "secondary" },
  ],
};

export default function AdminObraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [work, setWork] = useState<WorkEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    clientApi.get<WorkEntity>(`/api/admin/works/${params.id}`).then((res) => {
      if (res.ok) setWork(res.data);
      setLoading(false);
    });
  }, [params.id]);

  async function handleStatusChange(endpoint: string) {
    setChangingStatus(true);
    const res = await clientApi.post<WorkEntity>(`/api/admin/works/${params.id}/${endpoint}`);
    if (res.ok) {
      setWork(res.data);
    }
    setChangingStatus(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-6 animate-spin rounded-full border-2 border-cine-yellow border-t-transparent" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm text-cine-200">Obra não encontrada.</p>
        <Link href="/admin/obras" className="text-sm text-cine-yellow hover:underline">
          Voltar para obras
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-[28px] bg-cine-yellow" />
            <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
              {typeLabels[work.type] ?? work.type}
            </span>
          </div>
          <h1 className="mt-2 font-heading text-[42px] font-bold tracking-[-1.26px] text-cine-50">
            {work.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={work.status} />
          {(statusActions[work.status] ?? []).map((action) => (
            <button
              key={action.endpoint}
              type="button"
              onClick={() => handleStatusChange(action.endpoint)}
              disabled={changingStatus}
              className={`inline-flex h-[42px] items-center rounded-full px-4 text-[13px] font-[650] transition-colors disabled:opacity-50 ${
                action.variant === "primary"
                  ? "bg-cine-yellow text-cine-text-dark hover:bg-cine-yellow-dark"
                  : action.variant === "danger"
                    ? "border border-[rgba(215,54,39,0.44)] text-[#D73627] hover:bg-destructive/10"
                    : "border border-[rgba(248,245,239,0.22)] text-cine-50 hover:bg-cine-50/10"
              }`}
            >
              {changingStatus ? "..." : action.label}
            </button>
          ))}
          <Link
            href={`/admin/obras/${work.id}/editar`}
            className="inline-flex h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-4 text-[13px] font-[650] text-cine-50 transition-colors hover:bg-cine-50/10"
          >
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4">
          {work.thumbnail_image_url && (
            <div className="overflow-hidden rounded-[18px]">
              <Image
                src={work.thumbnail_image_url}
                alt={work.title}
                width={814}
                height={360}
                className="h-[360px] w-full object-cover"
              />
            </div>
          )}

          <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
            <h2 className="font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
              Sinopse
            </h2>
            <p className="mt-3 text-sm leading-[22.4px] text-cine-200">{work.synopsis}</p>
          </div>

          <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
            <h2 className="font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
              Detalhes
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                  Duração
                </dt>
                <dd className="mt-1 text-sm text-cine-50">{work.duration_minutes} min</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                  Ano
                </dt>
                <dd className="mt-1 text-sm text-cine-50">{work.release_year ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                  Classificação
                </dt>
                <dd className="mt-1 text-sm text-cine-50">{work.rating}</dd>
              </div>
              {work.director && (
                <div>
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                    Diretor
                  </dt>
                  <dd className="mt-1 text-sm text-cine-50">{work.director}</dd>
                </div>
              )}
              {work.stage && (
                <div>
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                    Etapa sugerida
                  </dt>
                  <dd className="mt-1 text-sm text-cine-50">{work.stage}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="space-y-4">
          {work.themes && work.themes.length > 0 && (
            <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                Temas
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {work.themes.map((theme) => (
                  <span
                    key={theme.id}
                    className="rounded-full border border-[rgba(170,147,249,0.34)] bg-[rgba(170,147,249,0.12)] px-3 py-1.5 text-sm text-cine-50"
                  >
                    {theme.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {work.bncc_skills && work.bncc_skills.length > 0 && (
            <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                BNCC
              </span>
              <div className="mt-3 space-y-2">
                {work.bncc_skills.map((skill) => (
                  <p key={skill.id} className="text-sm text-cine-200">
                    <span className="text-cine-yellow-light">{skill.code}</span> —{" "}
                    {skill.description}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              Atualização
            </span>
            <p className="mt-2 text-sm text-cine-200">
              {new Date(work.updated_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
