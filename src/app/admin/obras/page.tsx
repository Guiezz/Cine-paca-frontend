"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi } from "@/lib/api-client";
import type { WorkEntity, PaginatedResponse } from "@/types/api";
import { StatCard } from "@/components/admin/stat-card";
import { WorkTable } from "@/components/admin/work-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminObrasPage() {
  const [works, setWorks] = useState<WorkEntity[] | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loading = works === null;
  const list = works ?? [];

  useEffect(() => {
    const params: Record<string, string | number | boolean> = {};
    if (search) params.q = search;
    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    clientApi
      .get<PaginatedResponse<WorkEntity>>("/api/admin/works", { params })
      .then((res) => {
        if (res.ok) setWorks(res.data.data);
      });
  }, [search, statusFilter]);

  const published = list.filter((w) => w.status === "published").length;
  const draft = list.filter((w) => w.status === "draft").length;
  const withoutBncc = list.filter(
    (w) => !w.bncc_skills || w.bncc_skills.length === 0,
  ).length;

  return (
    <div className="space-y-[18px]">
      <div className="grid grid-cols-[1fr_164px] pt-4">
        <div className="flex flex-col gap-[11.4px]">
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-[28px] bg-cine-yellow" />
            <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
              GESTÃO DO ACERVO
            </span>
          </div>
          <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
            Obras cadastradas
          </h1>
          <p className="max-w-[720px] text-base leading-[24.8px] text-cine-200">
            Acompanhe publicações, revise metadados pedagógicos e mantenha o acervo pronto para
            professores encontrarem obras adequadas.
          </p>
        </div>
        <Link
          href="/admin/obras/nova"
          className="flex h-[42px] items-center justify-center self-end rounded-full bg-cine-yellow px-4 text-[13px] font-[650] tracking-[0.01em] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark"
        >
          Cadastrar nova obra
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-1">
        <StatCard value={published} label="PUBLICADAS" />
        <StatCard value={draft} label="EM REVISÃO" />
        <StatCard value={withoutBncc} label="SEM BNCC" />
        <StatCard value={list.length} label="LISTADAS" />
      </div>

      <div className="flex items-center gap-3 rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-4">
        <div className="relative flex-1">
          <input
            placeholder="Buscar obras cadastradas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[44px] w-full rounded-full border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-[14px] text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="h-[42px] w-[166px] rounded-full border border-[rgba(80,64,107,0.70)] bg-[rgba(29,17,48,0.38)] px-4 text-base text-cine-200">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="draft">Revisão</SelectItem>
            <SelectItem value="archived">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-6 animate-spin rounded-full border-2 border-cine-yellow border-t-transparent" />
        </div>
      ) : (
        <WorkTable works={list} />
      )}
    </div>
  );
}
