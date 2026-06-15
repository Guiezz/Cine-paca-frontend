"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/lib/api-client";
import type { AuditLogEntity, PaginatedResponse } from "@/types/api";

export default function AdminAuditoriaPage() {
  const [items, setItems] = useState<AuditLogEntity[] | null>(null);

  useEffect(() => {
    clientApi
      .get<PaginatedResponse<AuditLogEntity>>("/api/admin/audit-logs")
      .then((res) => {
        if (res.ok) setItems(res.data.data);
      });
  }, []);

  const list = items ?? [];

  return (
    <div className="space-y-[18px]">
      <div className="pt-4">
        <div className="flex flex-col gap-[11.4px]">
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-[28px] bg-cine-yellow" />
            <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
              ADMINISTRAÇÃO
            </span>
          </div>
          <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
            Auditoria
          </h1>
          <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
            Registro de ações administrativas no sistema.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                USUÁRIO
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                AÇÃO
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                ENTIDADE
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                DATA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(80,64,107,0.62)]">
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-cine-300">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="group">
                  <td className="px-4 py-3.5 text-cine-50">{item.actor.name}</td>
                  <td className="px-4 py-3.5 text-cine-200">{item.action}</td>
                  <td className="px-4 py-3.5 text-cine-200">
                    {item.entity_type}/{item.entity_id?.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3.5 text-cine-200">
                    {new Date(item.created_at).toLocaleString("pt-BR")}
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
