import type { WorkStatus } from "@/types/api";
import { cn } from "@/lib/utils";

const statusConfig: Record<WorkStatus, { label: string; className: string }> = {
  published: {
    label: "Publicado",
    className: "border-[rgba(170,147,249,0.40)] bg-[rgba(170,147,249,0.20)]",
  },
  draft: {
    label: "Revisão",
    className: "border-[rgba(255,182,0,0.46)] bg-[rgba(255,182,0,0.16)]",
  },
  archived: {
    label: "Arquivado",
    className: "border-[rgba(170,147,249,0.40)] bg-[rgba(170,147,249,0.20)] opacity-60",
  },
};

export function StatusBadge({
  status,
  label: customLabel,
}: {
  status?: WorkStatus;
  label?: string;
}) {
  if (customLabel) {
    return (
      <span
        className={cn(
          "inline-flex min-h-[28px] items-center rounded-full border px-[10px] py-[5.5px] text-[12px] font-[650] text-cine-50",
          "border-[rgba(255,182,0,0.46)] bg-[rgba(255,182,0,0.16)]",
        )}
      >
        {customLabel}
      </span>
    );
  }

  if (!status) return null;
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex min-h-[28px] items-center rounded-full border px-[10px] py-[5.5px] text-[12px] font-[650] text-cine-50",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
