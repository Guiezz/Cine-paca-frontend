"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi } from "@/lib/api-client";
import type { ThemeEntity } from "@/types/api";

export default function AdminTemasPage() {
  const [items, setItems] = useState<ThemeEntity[] | null>(null);

  useEffect(() => {
    clientApi.get<ThemeEntity[]>("/api/admin/themes").then((res) => {
      if (res.ok) setItems(res.data);
    });
  }, []);

  const list = items ?? [];

  return (
    <div className="space-y-[18px]">
      <div className="grid grid-cols-[1fr_164px] pt-4">
        <div className="flex flex-col gap-[11.4px]">
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-[28px] bg-cine-yellow" />
            <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
              TAXONOMIA
            </span>
          </div>
          <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
            Temas
          </h1>
          <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
            Gerencie os temas utilizados para categorizar as obras do acervo.
          </p>
        </div>
        <Link
          href="/admin/temas/novo"
          className="flex h-[42px] items-center justify-center self-end rounded-full bg-cine-yellow px-4 text-[13px] font-[650] tracking-[0.01em] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark"
        >
          Novo tema
        </Link>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                NOME
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                SLUG
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                CRIADO EM
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(80,64,107,0.62)]">
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-cine-300">
                  Nenhum tema encontrado.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="group">
                  <td className="px-4 py-3.5 text-cine-50">{item.name}</td>
                  <td className="px-4 py-3.5 text-cine-200">{item.slug}</td>
                  <td className="px-4 py-3.5 text-cine-200">
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/admin/temas/${item.id}/editar`}
                      className="inline-flex min-h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-4 text-[13px] font-[650] text-cine-50 transition-colors hover:bg-cine-50/10"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
