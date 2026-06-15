"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { clientApi } from "@/lib/api-client";
import type { ListEntity } from "@/types/api";
import { ListForm } from "@/components/admin/list-form";

export default function AdminListaEditarPage() {
  const params = useParams();
  const [list, setList] = useState<ListEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi.get<ListEntity>(`/api/admin/lists/${params.id}`).then((res) => {
      if (res.ok) setList(res.data);
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

  if (!list) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm text-cine-200">Lista não encontrada.</p>
        <Link href="/admin/listas" className="text-sm text-cine-yellow hover:underline">
          Voltar para listas
        </Link>
      </div>
    );
  }

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
          Editar lista
        </h1>
        <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
          Editando <strong className="text-cine-50">{list.title}</strong>.
        </p>
      </div>

      <ListForm initial={list} />
    </div>
  );
}
