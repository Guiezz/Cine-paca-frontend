"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { clientApi } from "@/lib/api-client";
import type { PaginatedResponse, ThemeEntity } from "@/types/api";
import { Check, Plus, X } from "lucide-react";

export interface SelectedTheme {
  id: string;
  name: string;
}

/** A API recusa per_page acima de 50. */
const PER_PAGE = 50;

/** Ignora caixa e acento para comparar nomes de tema. */
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

interface ThemeSelectorProps {
  selected: SelectedTheme[];
  onAdd: (theme: SelectedTheme) => void;
  onRemove: (id: string) => void;
  inputId?: string;
}

export function ThemeSelector({ selected, onAdd, onRemove, inputId }: ThemeSelectorProps) {
  const listboxId = `${inputId ?? "temas"}-listbox`;
  // Guarda o termo junto do resultado: assim dá para saber, no render, que a
  // lista ainda é da busca anterior e não decidir "criar tema" com dado velho.
  const [result, setResult] = useState<{ query: string; items: ThemeEntity[] }>({
    query: "",
    items: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [nextNewId, setNextNewId] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Busca no servidor: a API limita per_page a 50, então filtrar no cliente
  // deixaria de fora qualquer tema além dos 50 primeiros.
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      const params: Record<string, string | number> = { per_page: PER_PAGE };
      const trimmedQuery = query.trim();
      if (trimmedQuery) params.q = trimmedQuery;

      const res = await clientApi.get<PaginatedResponse<ThemeEntity>>("/api/themes", {
        params,
      });
      if (cancelled) return;

      if (res.ok) {
        setResult({ query: trimmedQuery, items: res.data.data });
        setError(null);
      } else {
        setResult({ query: trimmedQuery, items: [] });
        setError(res.error);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const selectedNames = new Set(selected.map((t) => normalize(t.name)));
  const trimmed = query.trim();
  const normalizedQuery = normalize(trimmed);
  const isStale = result.query !== trimmed;

  const suggestions = isStale
    ? []
    : result.items.filter((t) => !selectedNames.has(normalize(t.name)));

  // Só oferece criar quando o nome não existe ainda — é o que evitava a
  // taxonomia encher de "Emoções" / "emoções" / "Emoçoes".
  const exactMatch = result.items.find((t) => normalize(t.name) === normalizedQuery);
  const alreadySelected = normalizedQuery.length > 0 && selectedNames.has(normalizedQuery);
  // Enquanto a busca não voltou, não oferece criar: o nome pode já existir.
  const canCreate = trimmed.length > 0 && !isStale && !exactMatch && !alreadySelected;

  const options: Array<{ kind: "existing"; theme: ThemeEntity } | { kind: "create" }> = [
    ...suggestions.map((theme) => ({ kind: "existing" as const, theme })),
    ...(canCreate ? [{ kind: "create" as const }] : []),
  ];

  function choose(index: number) {
    const option = options[index];
    if (!option) return;

    if (option.kind === "existing") {
      onAdd({ id: option.theme.id, name: option.theme.name });
    } else {
      onAdd({ id: `new-${nextNewId}`, name: trimmed });
      setNextNewId((n) => n + 1);
    }
    setQuery("");
    setHighlight(0);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault(); // dentro de um <form>, Enter submeteria tudo
      if (open && options.length > 0) choose(Math.min(highlight, options.length - 1));
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (options.length === 0 ? 0 : (h + 1) % options.length));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (options.length === 0 ? 0 : (h - 1 + options.length) % options.length));
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
          {selected.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(170,147,249,0.34)] bg-[rgba(170,147,249,0.12)] px-3 py-1.5 text-sm text-cine-50"
            >
              {tag.name}
              {tag.id.startsWith("new-") && (
                <span className="font-mono text-[10px] text-cine-yellow-light" title="Será criado ao salvar">
                  novo
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(tag.id)}
                aria-label={`Remover tema ${tag.name}`}
                className="inline-flex size-4 items-center justify-center rounded-full text-cine-300 hover:text-cine-50"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
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
          placeholder="Buscar ou criar um tema..."
          className="h-[42px] w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
        />

        {open && (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Temas disponíveis"
            className="absolute z-50 mt-1 max-h-[220px] w-full overflow-y-auto rounded-[10px] border border-[rgba(80,64,107,0.74)] bg-[#201337] shadow-lg"
          >
            {error && (
              <p role="alert" className="px-3 py-2.5 text-sm text-destructive">
                Não foi possível carregar os temas: {error}
              </p>
            )}

            {alreadySelected && (
              <p className="px-3 py-2.5 text-sm text-cine-300">
                &quot;{trimmed}&quot; já está nesta obra.
              </p>
            )}

            {isStale && !error && (
              <p className="px-3 py-2.5 text-sm text-cine-300">Buscando...</p>
            )}

            {!isStale && options.length === 0 && !alreadySelected && !error && (
              <p className="px-3 py-2.5 text-sm text-cine-300">
                {trimmed ? "Nenhum tema encontrado." : "Nenhum tema cadastrado ainda."}
              </p>
            )}

            {options.map((option, index) => (
              <button
                key={option.kind === "existing" ? option.theme.id : "__create"}
                type="button"
                role="option"
                aria-selected={index === highlight}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => choose(index)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                  index === highlight ? "bg-cine-purple/30" : ""
                }`}
              >
                {option.kind === "existing" ? (
                  <>
                    <Check className="size-4 shrink-0 text-cine-300" />
                    <span className="text-cine-50">{option.theme.name}</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-4 shrink-0 text-cine-yellow" />
                    <span className="text-cine-50">
                      Criar tema &quot;{trimmed}&quot;
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
