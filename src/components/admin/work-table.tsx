import Link from "next/link";
import Image from "next/image";
import type { WorkEntity } from "@/types/api";
import { StatusBadge } from "@/components/admin/status-badge";

const typeLabels: Record<string, string> = {
  short: "Curta",
  documentary: "Documentário",
  animation: "Animação",
};

function ratingLabel(rating: string) {
  if (rating === "L") return "Livre";
  return rating;
}

function curatoriaText(work: WorkEntity): string[] {
  const parts: string[] = [];
  if (work.stage) parts.push(work.stage);
  if (work.themes && work.themes.length > 0) {
    parts.push(work.themes.map((t) => t.name).join(" · "));
  }
  if (work.bncc_skills && work.bncc_skills.length > 0) {
    const areas = [...new Set(work.bncc_skills.map((s) => s.area))];
    parts.push(areas.join(" · "));
  }
  if (!parts.length && work.pedagogical_use) {
    parts.push(work.pedagogical_use);
  }
  return parts;
}

function updatedAt(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const oneDay = 86400000;

  if (diff < oneDay && d.getDate() === now.getDate()) {
    return `Hoje, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }
  if (diff < 2 * oneDay && d.getDate() === now.getDate() - 1) {
    return `Ontem, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  }).replace(".", "") + `, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function WorkTable({ works }: { works: WorkEntity[] }) {
  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm text-cine-200">Nenhuma obra encontrada.</p>
        <p className="text-xs text-cine-300">Tente ajustar os filtros ou cadastre uma nova obra.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="w-[363px] px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              OBRA
            </th>
            <th className="w-[129px] px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              CLASSIFICAÇÃO
            </th>
            <th className="w-[284px] px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              CURADORIA
            </th>
            <th className="w-[117px] px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              STATUS
            </th>
            <th className="w-[117px] px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              ATUALIZAÇÃO
            </th>
            <th className="w-[167px] px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              AÇÕES
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(80,64,107,0.62)]">
          {works.map((work) => {
            const curatoria = curatoriaText(work);
            return (
              <tr key={work.id} className="group">
                <td className="px-4 py-3.5">
                  <div className="grid grid-cols-[94px_1fr] gap-[13px]">
                    <div className="size-[94px] overflow-hidden rounded-[10px] bg-cine-purple/20">
                      {work.thumbnail_image_url ? (
                        <Image
                          src={work.thumbnail_image_url}
                          alt=""
                          width={94}
                          height={67}
                          className="h-[67px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-cine-300">
                          sem img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-[6.5px]">
                      <div>
                        <p className="font-heading text-base font-bold tracking-[-0.16px] text-cine-50 leading-snug">
                          {work.title}
                        </p>
                      </div>
                      <p className="text-[13px] leading-[18.2px] text-cine-200">
                        {typeLabels[work.type] ?? work.type}{work.duration_minutes ? ` · ${work.duration_minutes} min` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <div className="inline-flex min-h-[28px] w-[50px] items-center justify-center rounded-full border border-[rgba(170,147,249,0.40)] bg-[rgba(170,147,249,0.20)] px-[10px] py-[5.5px]">
                    <span className="text-[12px] font-[650] text-cine-50">
                      {ratingLabel(work.rating)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  {curatoria.length > 0 ? (
                    <div className="text-[13px] leading-[18.2px] text-cine-200">
                      {curatoria.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[13px] text-cine-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 align-middle">
                  {work.bncc_skills && work.bncc_skills.length === 0 && work.status === "published" ? (
                    <StatusBadge label="Sem BNCC" />
                  ) : (
                    <StatusBadge status={work.status} />
                  )}
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <span className="text-[13px] leading-[18.2px] text-cine-200">
                    {updatedAt(work.updated_at)}
                  </span>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <div className="flex items-center justify-end gap-[8px]">
                    <Link
                      href={`/admin/obras/${work.id}`}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(248,245,239,0.22)] px-4 text-[13px] font-[650] tracking-[0.01em] text-cine-50 transition-colors hover:bg-cine-50/10"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/admin/obras/${work.id}/editar`}
                      className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(248,245,239,0.22)] px-4 text-[13px] font-[650] tracking-[0.01em] text-cine-50 transition-colors hover:bg-cine-50/10"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
