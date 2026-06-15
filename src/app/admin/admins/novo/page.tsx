"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { AdminEntity } from "@/types/api";

export default function AdminAdminNovoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "h-[44px] w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await clientApi.post<AdminEntity>("/api/admin/admins", {
      name,
      email,
      password,
    });
    if (res.ok) {
      router.push("/admin/admins");
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
            ADMINISTRAÇÃO
          </span>
        </div>
        <h1 className="font-heading text-[58px] font-bold leading-[59.74px] tracking-[-1.74px] text-cine-50">
          Novo admin
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
            placeholder="Nome do admin"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
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
            onClick={() => router.push("/admin/admins")}
            className="inline-flex h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-5 text-sm font-[650] text-cine-50 transition-colors hover:bg-cine-50/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim() || !password}
            className="inline-flex h-[42px] items-center rounded-full bg-cine-yellow px-5 text-sm font-[650] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
