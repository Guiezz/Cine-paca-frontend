"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { clientApi } from "@/lib/api-client";
import type { BnccSkillEntity } from "@/types/api";
import { X, Search } from "lucide-react";

/** A API recusa per_page acima de 50. */
const PER_PAGE = 50;

/** Ignora caixa e acento ao comparar etapas. */
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

interface BnccSkillsSelectorProps {
  selected: BnccSkillEntity[];
  onAdd: (skill: BnccSkillEntity) => void;
  onRemove: (id: string) => void;
  inputId?: string;
  /** Etapa escolhida na obra: usada para ordenar, nunca para esconder. */
  stage?: string;
}

export function BnccSkillsSelector({
  selected,
  onAdd,
  onRemove,
  inputId,
  stage,
}: BnccSkillsSelectorProps) {
  // O termo viaja junto do resultado para dar para saber, no render, que a
  // lista ainda é da busca anterior.
  const [result, setResult] = useState<{ query: string; items: BnccSkillEntity[] }>({
    query: "",
    items: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedIds = new Set(selected.map((s) => s.id));
  const listboxId = `${inputId ?? "bncc"}-listbox`;

  // A API limita per_page a 50, então a busca precisa ir ao servidor: filtrar
  // no cliente deixaria de fora qualquer habilidade além das 50 primeiras.
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      const params: Record<string, string | number> = { per_page: PER_PAGE };
      const trimmed = query.trim();
      if (trimmed) params.q = trimmed;

      const res = await clientApi.get<{ data: BnccSkillEntity[] }>("/api/bncc", {
        params,
      });
      if (cancelled) return;

      if (res.ok) {
        setResult({ query: trimmed, items: res.data.data });
        setError(null);
      } else {
        setResult({ query: trimmed, items: [] });
        setError(res.error);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const isStale = result.query !== query.trim();
  const filtered = (isStale ? [] : result.items)
    .filter((s) => !selectedIds.has(s.id))
    // Ordena as da etapa da obra para o topo. Deliberadamente ordenação e não
    // filtro: a API de BNCC está vazia, então não dá para confirmar que a
    // string de etapa dela bate com a das obras — filtrar por igualdade
    // esconderia tudo se os formatos divergirem, ordenar não esconde nada.
    .sort((a, b) => {
      if (!stage) return 0;
      const target = normalize(stage);
      const aMatch = normalize(a.stage) === target ? 0 : 1;
      const bMatch = normalize(b.stage) === target ? 0 : 1;
      return aMatch - bMatch;
    });

  function choose(index: number) {
    const skill = filtered[index];
    if (!skill) return;
    onAdd(skill);
    setQuery("");
    setHighlight(0);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // dentro de um <form>, Enter submeteria a obra
      if (open && filtered.length > 0) choose(Math.min(highlight, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (filtered.length === 0 ? 0 : (h + 1) % filtered.length));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (filtered.length === 0 ? 0 : (h - 1 + filtered.length) % filtered.length));
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
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
                aria-label={`Remover habilidade ${skill.code}`}
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
            id={inputId}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setHighlight(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            placeholder="Buscar habilidade por código, área ou descrição..."
            className="h-[44px] w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] pl-9 pr-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
          />
        </div>

        {/* Abre no foco, não só depois de digitar: antes não havia como
            descobrir quais habilidades existem sem adivinhar um termo. */}
        {open && (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Habilidades BNCC disponíveis"
            className="absolute z-50 mt-1 max-h-[220px] w-full overflow-y-auto rounded-[10px] border border-[rgba(80,64,107,0.74)] bg-[#201337] shadow-lg"
          >
            {error ? (
              <p role="alert" className="px-3 py-3 text-sm text-destructive">
                Não foi possível carregar as habilidades: {error}
              </p>
            ) : isStale ? (
              <p className="px-3 py-3 text-sm text-cine-300">Buscando...</p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-cine-300">
                {query.trim()
                  ? "Nenhuma habilidade encontrada."
                  : "Nenhuma habilidade BNCC cadastrada ainda."}
              </p>
            ) : (
              filtered.map((skill, index) => (
                <button
                  key={skill.id}
                  type="button"
                  role="option"
                  aria-selected={index === highlight}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => choose(index)}
                  className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                    index === highlight ? "bg-cine-purple/30" : ""
                  }`}
                >
                  <span className="shrink-0 font-mono text-[11px] text-cine-yellow-light">
                    {skill.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-cine-50">{skill.description}</p>
                    <p className="text-[11px] text-cine-300">
                      {skill.area} · {skill.stage}
                      {stage && normalize(skill.stage) === normalize(stage) && (
                        <span className="ml-1 text-cine-yellow-light">· etapa da obra</span>
                      )}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
