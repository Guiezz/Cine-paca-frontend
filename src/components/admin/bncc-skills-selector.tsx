"use client";

import { useEffect, useState, useRef } from "react";
import { clientApi } from "@/lib/api-client";
import type { BnccSkillEntity } from "@/types/api";
import { X, Search, Check } from "lucide-react";

interface BnccSkillsSelectorProps {
  selected: BnccSkillEntity[];
  onAdd: (skill: BnccSkillEntity) => void;
  onRemove: (id: string) => void;
}

export function BnccSkillsSelector({ selected, onAdd, onRemove }: BnccSkillsSelectorProps) {
  const [skills, setSkills] = useState<BnccSkillEntity[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedIds = new Set(selected.map((s) => s.id));

  useEffect(() => {
    clientApi.get<{ data: BnccSkillEntity[] }>("/api/bncc").then((res) => {
      if (res.ok) setSkills(res.data.data);
    });
  }, []);

  const filtered = skills.filter(
    (s) =>
      !selectedIds.has(s.id) &&
      (s.code.toLowerCase().includes(query.toLowerCase()) ||
        s.area.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())),
  );

  function handleSelect(skill: BnccSkillEntity) {
    onAdd(skill);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(170,147,249,0.34)] bg-[rgba(170,147,249,0.12)] px-3 py-1.5 text-sm text-cine-50"
            >
              <span className="font-mono text-[11px] text-cine-yellow-light">{skill.code}</span>
              <span>{skill.area}</span>
              <button
                type="button"
                onClick={() => onRemove(skill.id)}
                className="inline-flex size-4 items-center justify-center rounded-full text-cine-300 hover:text-cine-50"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cine-300" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder="Buscar habilidade BNCC por código, área ou descrição..."
            className="h-[44px] w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] pl-9 pr-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
          />
        </div>

        {open && query && (
          <div className="absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-[10px] border border-[rgba(80,64,107,0.74)] bg-[#201337] shadow-lg">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-cine-300">Nenhuma habilidade encontrada.</p>
            ) : (
              filtered.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSelect(skill)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-cine-purple/30"
                >
                  <span className="shrink-0 font-mono text-[11px] text-cine-yellow-light">
                    {skill.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-cine-50">{skill.description}</p>
                    <p className="text-[11px] text-cine-300">{skill.area} · {skill.stage}</p>
                  </div>
                  <Check className="mt-0.5 size-4 shrink-0 text-transparent" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
