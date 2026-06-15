"use client";

import type { WorkEntity } from "@/types/api";
import { GripVertical, X } from "lucide-react";

interface OrderedItem {
  work: WorkEntity;
  comment?: string;
}

interface OrderedListProps {
  items: OrderedItem[];
  onRemove: (workId: string) => void;
  onComment: (workId: string, comment: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function OrderedList({ items, onRemove, onComment, onMoveUp, onMoveDown }: OrderedListProps) {
  if (items.length === 0) {
    return (
      <p className="text-[13px] leading-[18.85px] text-cine-300">
        Nenhuma obra adicionada. Busque e adicione obras acima.
      </p>
    );
  }

  return (
    <div className="space-y-[10px]">
      {items.map((item, index) => (
        <div
          key={item.work.id}
          className="grid grid-cols-[28px_34px_1fr_auto] gap-3 rounded-[13px] border border-[rgba(80,64,107,0.70)] bg-[rgba(29,17,48,0.36)] p-3"
        >
          <div className="flex size-7 items-center justify-center rounded-[9px] bg-cine-yellow">
            <span className="text-center text-[12px] font-extrabold text-cine-text-dark">
              {index + 1}
            </span>
          </div>

          <div className="flex size-[34px] items-center justify-center rounded-[10px] border border-[rgba(170,147,249,0.36)] bg-[rgba(42,26,69,0.72)]">
            <GripVertical className="size-[18px] text-cine-200" />
          </div>

          <div className="flex flex-col justify-center gap-1.5">
            <p className="text-[14px] font-bold text-cine-50">{item.work.title}</p>
            {item.comment !== undefined && (
              <input
                value={item.comment}
                onChange={(e) => onComment(item.work.id, e.target.value)}
                placeholder="Observação pedagógica (opcional)"
                className="h-7 rounded-md border border-[rgba(170,147,249,0.2)] bg-[rgba(29,17,48,0.3)] px-2 text-[12px] text-cine-200 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            {index > 0 && (
              <button
                type="button"
                onClick={() => onMoveUp(index)}
                className="flex size-7 items-center justify-center rounded-md text-cine-300 hover:text-cine-50"
              >
                ↑
              </button>
            )}
            {index < items.length - 1 && (
              <button
                type="button"
                onClick={() => onMoveDown(index)}
                className="flex size-7 items-center justify-center rounded-md text-cine-300 hover:text-cine-50"
              >
                ↓
              </button>
            )}
            <button
              type="button"
              onClick={() => onRemove(item.work.id)}
              className="flex size-7 items-center justify-center rounded-md text-cine-300 hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
