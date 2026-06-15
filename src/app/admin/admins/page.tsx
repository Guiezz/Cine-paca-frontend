"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi } from "@/lib/api-client";
import type { AdminEntity } from "@/types/api";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  superadmin: "Super Admin",
};

const statusLabels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
};

export default function AdminAdminsPage() {
  const [items, setItems] = useState<AdminEntity[] | null>(null);

  useEffect(() => {
    clientApi.get<AdminEntity[]>("/api/admin/admins").then((res) => {
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
              ADMINISTRAÇÃO
            </span>
          </div>
          <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
            Admins
          </h1>
          <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
            Gerencie os administradores do sistema.
          </p>
        </div>
        <Link
          href="/admin/admins/novo"
          className="flex h-[42px] items-center justify-center self-end rounded-full bg-cine-yellow px-4 text-[13px] font-[650] tracking-[0.01em] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark"
        >
          Novo admin
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
                EMAIL
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                PERFIL
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                STATUS
              </th>
              <th className="px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(80,64,107,0.62)]">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-cine-300">
                  Nenhum admin encontrado.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="group">
                  <td className="px-4 py-3.5 text-cine-50">{item.name}</td>
                  <td className="px-4 py-3.5 text-cine-200">{item.email}</td>
                  <td className="px-4 py-3.5 text-cine-200">
                    {roleLabels[item.role] ?? item.role}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex min-h-[28px] items-center rounded-full px-3 text-xs font-[650] ${
                        item.status === "active"
                          ? "border border-green-500/40 bg-green-500/20 text-green-400"
                          : "border border-cine-400/40 bg-cine-400/20 text-cine-200"
                      }`}
                    >
                      {statusLabels[item.status] ?? item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/admin/admins/${item.id}/editar`}
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
