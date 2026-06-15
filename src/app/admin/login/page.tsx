"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@cinepaca.local");
  const [password, setPassword] = useState("admin123");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/obras");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push("/admin/obras");
    }
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col"
      style={{
        background:
          "radial-gradient(179.12% 89.28% at 76% 6%, rgba(52, 18, 172, 0.38) 0%, rgba(52, 18, 172, 0.00) 14%), linear-gradient(180deg, #1D1130 0%, #1E004E 42%, #120A22 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,rgba(0,0,0,0)_72%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 46.67%, #F8F5EF 46.67%, #F8F5EF 50%, rgba(248,245,239,0) 50%, rgba(248,245,239,0) 96.67%), linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 46.67%, #F8F5EF 46.67%, #F8F5EF 50%, rgba(248,245,239,0) 50%, rgba(248,245,239,0) 96.67%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1080px] flex-col px-0 pt-7 pb-14">
        <header className="flex items-center justify-between pb-8 pl-[72px] pr-0">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-heading text-lg font-bold tracking-tight text-cine-50">
                Cine Paca
              </p>
              <p className="text-xs tracking-[0.08em] uppercase text-cine-200">
                ADMINISTRAÇÃO DO ACERVO
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex min-h-[38px] items-center rounded-full border border-[rgba(80,64,107,0.68)] bg-[rgba(42,26,69,0.72)] px-4 text-sm font-[550] tracking-[0.01em] text-cine-200 transition-colors hover:text-cine-50"
          >
            Voltar ao catálogo
          </Link>
        </header>

        <div className="flex gap-[42px] py-[30px]">
          <section className="flex flex-1 flex-col gap-[14.9px] pt-[7px]">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-[28px] bg-cine-yellow" />
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-cine-yellow-light">
                ACESSO RESTRITO
              </span>
            </div>

            <h1 className="font-heading text-[68px] font-bold leading-[69.36px] tracking-[-2.04px] text-cine-50">
              Gestão curatorial
              <br />
              do acervo Cine
              <br />
              Paca.
            </h1>

            <p className="max-w-[640px] pt-[4.49px] text-lg leading-[27.9px] text-cine-200">
              Área para administradores e curadores cadastrarem obras,
              <br />
              organizarem listas pedagógicas e manterem o catálogo pronto para
              <br />
              professores.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-[15.1px]">
              <div className="flex flex-col gap-[6.265px] rounded-xl border border-[rgba(80,64,107,0.72)] bg-[#1B0F2F] p-[15px]">
                <strong className="font-heading text-[17px] font-bold leading-[19.38px] tracking-[-0.17px] text-cine-50">
                  Obras
                </strong>
                <p className="text-[13px] leading-[18.85px] text-cine-200">
                  Cadastro de filmes, curtas, frames, classificação e metadados técnicos.
                </p>
              </div>
              <div className="flex flex-col gap-[6.34px] rounded-xl border border-[rgba(80,64,107,0.72)] bg-[#1B0F2F] p-[15px]">
                <strong className="font-heading text-[17px] font-bold leading-[19.38px] tracking-[-0.17px] text-cine-50">
                  Curadoria
                </strong>
                <p className="text-[13px] leading-[18.85px] text-cine-200">
                  BNCC, faixa etária, temas, objetivos e orientação de uso em sala.
                </p>
              </div>
              <div className="flex flex-col gap-[6.34px] rounded-xl border border-[rgba(80,64,107,0.72)] bg-[#1B0F2F] p-[15px]">
                <strong className="font-heading text-[17px] font-bold leading-[19.38px] tracking-[-0.17px] text-cine-50">
                  Listas
                </strong>
                <p className="text-[13px] leading-[18.85px] text-cine-200">
                  Sequências de obras para professores encontrarem percursos prontos.
                </p>
              </div>
            </div>
          </section>

          <section
            className="flex w-[430px] shrink-0 flex-col gap-[7px] rounded-[22px] border border-[rgba(80,64,107,0.74)] p-[28px] shadow-[0_28px_70px_0_rgba(0,0,0,0.26)]"
            style={{
              background:
                "radial-gradient(113.31% 144.84% at 88% 10%, rgba(255, 182, 0, 0.14) 0%, rgba(255, 182, 0, 0.00) 12.9%), #221439",
            }}
          >
            <h2 className="font-heading text-[28px] font-bold leading-[31.36px] tracking-[-0.56px] text-cine-50">
              Entrar no admin
            </h2>
            <p className="text-sm leading-[21.7px] text-cine-200">
              Use as credenciais da equipe para acessar a gestão do acervo e das listas curatoriais.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-[17.03px] pb-[13px]">
              <div className="flex flex-col gap-[7px]">
                <label className="font-mono text-[11px] tracking-[0.07em] uppercase text-cine-yellow-light">
                  E-MAIL INSTITUCIONAL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-[46px] rounded-xl border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-[13px] text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
                  placeholder="admin@cinepaca.local"
                />
              </div>

              <div className="flex flex-col gap-[7px]">
                <label className="font-mono text-[11px] tracking-[0.07em] uppercase text-cine-yellow-light">
                  SENHA
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-[46px] rounded-xl border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-[13px] text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
                  placeholder="admin123"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 py-[3px] pl-[4px]">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(c) => setRemember(!!c)}
                    className="size-[17px] rounded-[2.5px] border-0 bg-cine-yellow data-checked:bg-cine-yellow [&_svg]:hidden"
                  />
                  <span className="font-mono text-[13px] tracking-[0.07em] uppercase text-cine-200">
                    MANTER SESSÃO
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@cinepaca.local");
                    setPassword("admin123");
                  }}
                  className="text-[13px] font-[650] text-cine-yellow-light transition-colors hover:text-cine-yellow"
                >
                  Entrar como protótipo
                </button>
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-cine-yellow px-[111.59px] text-[13px] font-[650] tracking-[0.01em] text-cine-text-dark hover:bg-cine-yellow-dark"
              >
                {loading ? "Entrando..." : "Acessar administração"}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
