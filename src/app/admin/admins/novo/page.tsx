"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { AdminEntity } from "@/types/api";
import { adminButton, adminInput, adminLabel } from "@/components/admin/form-controls";

export default function AdminAdminNovoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = adminInput();

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
        <h1 className="font-heading text-3xl md:text-5xl lg:text-[58px] font-bold leading-tight lg:leading-[59.74px] tracking-tight lg:tracking-[-1.74px] text-cine-50">
          Novo admin
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
            placeholder="Nome do admin"
            className={inputClass}
          />
        </div>

        <div>
          <label className={adminLabel()}>
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
          <label className={adminLabel()}>
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
            className={adminButton({ variant: "secondary" })}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim() || !password}
            className={adminButton({ variant: "primary" })}
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
