"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  tags: Tag[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  placeholder?: string;
}

export function TagInput({ tags, onAdd, onRemove, placeholder }: TagInputProps) {
  const [value, setValue] = useState("");

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(170,147,249,0.34)] bg-[rgba(170,147,249,0.12)] px-3 py-1.5 text-sm text-cine-50"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => onRemove(tag.id)}
              className="inline-flex size-4 items-center justify-center rounded-full text-cine-300 hover:text-cine-50"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Digite um tema..."}
          className="h-[42px] flex-1 rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-[42px] items-center rounded-[10px] border border-[rgba(248,245,239,0.22)] px-4 text-sm font-[650] text-cine-50 transition-colors hover:bg-cine-50/10"
        >
          Adicionar tema
        </button>
      </div>
    </div>
  );
}
