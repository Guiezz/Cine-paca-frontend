export function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[16px] border border-[rgba(80,64,107,0.72)] bg-[#1F1235] px-4 py-4">
      <span className="font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-cine-yellow-light">
        {label}
      </span>
      <strong className="font-heading text-[25px] font-bold leading-none tracking-[-0.5px] text-cine-50">
        {value}
      </strong>
    </div>
  );
}
