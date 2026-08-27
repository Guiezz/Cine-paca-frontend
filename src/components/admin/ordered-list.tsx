"use client";

import { useState } from "react";
import type { WorkEntity } from "@/types/api";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";

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
  onReorder: (from: number, to: number) => void;
}

export function OrderedList({
  items,
  onRemove,
  onComment,
  onMoveUp,
  onMoveDown,
  onReorder,
}: OrderedListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function endDrag() {
    setDragIndex(null);
    setOverIndex(null);
  }

  if (items.length === 0) {
    return (
      <p className="text-[13px] leading-[18.85px] text-cine-300">
        Nenhuma obra adicionada. Busque e adicione obras acima.
      </p>
    );
  }

  return (
    <ol className="space-y-[10px]">
      {items.map((item, index) => (
        <li
          key={item.work.id}
          // A linha é o alvo do drop; só a alça inicia o arraste, para não
          // roubar a seleção de texto do campo de observação.
          onDragOver={(e) => {
            if (dragIndex === null) return;
            e.preventDefault(); // sem isto o onDrop nunca dispara
            e.dataTransfer.dropEffect = "move";
            if (overIndex !== index) setOverIndex(index);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex !== null && dragIndex !== index) {
              onReorder(dragIndex, index);
            }
            endDrag();
          }}
          className={cn(
            "grid grid-cols-[28px_34px_1fr_auto] gap-3 rounded-[13px] border border-[rgba(80,64,107,0.70)] bg-[rgba(29,17,48,0.36)] p-3 transition-opacity",
            dragIndex === index && "opacity-40",
            overIndex === index &&
              dragIndex !== null &&
              dragIndex !== index &&
              "border-cine-yellow",
          )}
        >
          <div className="flex size-7 items-center justify-center rounded-[9px] bg-cine-yellow">
            <span className="text-center text-[12px] font-extrabold text-cine-text-dark">
              {index + 1}
            </span>
          </div>

          <div
            draggable
            onDragStart={(e) => {
              setDragIndex(index);
              e.dataTransfer.effectAllowed = "move";
              // O Firefox só inicia o arraste se houver dado no dataTransfer.
              e.dataTransfer.setData("text/plain", String(index));
            }}
            onDragEnd={endDrag}
            title={`Arraste para reordenar "${item.work.title}"`}
            className="flex size-[34px] cursor-grab items-center justify-center rounded-[10px] border border-[rgba(170,147,249,0.36)] bg-[rgba(42,26,69,0.72)] active:cursor-grabbing"
          >
            <GripVertical className="size-[18px] text-cine-200" />
          </div>

          <div className="flex flex-col justify-center gap-1.5">
            <p className="text-[14px] font-bold text-cine-50">{item.work.title}</p>
            <input
              value={item.comment ?? ""}
              onChange={(e) => onComment(item.work.id, e.target.value)}
              placeholder="Observação pedagógica (opcional)"
              aria-label={`Observação pedagógica para "${item.work.title}"`}
              className="h-7 rounded-md border border-[rgba(170,147,249,0.2)] bg-[rgba(29,17,48,0.3)] px-2 text-[12px] text-cine-200 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
            />
          </div>

          <div className="flex items-center gap-1">
            {/* Sempre renderizados e desabilitados nas pontas: se sumissem, os
                botões pulariam de posição a cada movimento. */}
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              aria-label={`Mover "${item.work.title}" para cima`}
              className="flex size-7 items-center justify-center rounded-md text-cine-300 hover:text-cine-50 disabled:opacity-25 disabled:hover:text-cine-300"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === items.length - 1}
              aria-label={`Mover "${item.work.title}" para baixo`}
              className="flex size-7 items-center justify-center rounded-md text-cine-300 hover:text-cine-50 disabled:opacity-25 disabled:hover:text-cine-300"
            >
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.work.id)}
              aria-label={`Remover "${item.work.title}" da lista`}
              className="flex size-7 items-center justify-center rounded-md text-cine-300 hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
