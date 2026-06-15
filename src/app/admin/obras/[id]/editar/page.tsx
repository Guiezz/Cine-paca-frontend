"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { clientApi } from "@/lib/api-client";
import type { WorkEntity } from "@/types/api";
import { WorkForm } from "@/components/admin/work-form";

export default function AdminObraEditarPage() {
  const params = useParams();
  const [work, setWork] = useState<WorkEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi.get<WorkEntity>(`/api/admin/works/${params.id}`).then((res) => {
      if (res.ok) setWork(res.data);
      setLoading(false);
    });
  }, [params.id]);

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
    <div className="space-y-[18px]">
      <div className="flex flex-col gap-[11.4px] pt-4">
        <div className="flex items-center gap-2">
          <div className="h-[2px] w-[28px] bg-cine-yellow" />
          <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
            GESTÃO DO ACERVO
          </span>
        </div>
        <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
          Editar obra
        </h1>
        <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
          Editando <strong className="text-cine-50">{work.title}</strong>.
        </p>
      </div>

      <WorkForm initial={work} />
    </div>
  );
}
