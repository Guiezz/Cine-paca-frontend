"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type { ListEntity, ThemeEntity, WorkEntity } from "@/types/api";
import { STAGE_OPTIONS } from "@/lib/stages";
import { STAGE_LABELS } from "@/lib/labels";
import { TagInput } from "@/components/admin/tag-input";
import { ImageUpload } from "@/components/admin/image-upload";
import { WorkSearch } from "@/components/admin/work-search";
import { OrderedList } from "@/components/admin/ordered-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderedItem {
  work: WorkEntity;
  comment?: string;
}

interface ListFormProps {
  initial?: ListEntity;
}

export function ListForm({ initial }: ListFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [stage, setStage] = useState(initial?.stage ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url ?? "");
  const [adminNote, setAdminNote] = useState(initial?.admin_note ?? "");

  const [orderedItems, setOrderedItems] = useState<OrderedItem[]>(
    initial?.items?.map((i) => ({
      work: {
        id: i.work.id,
        title: i.work.title,
        slug: i.work.slug,
        type: i.work.type,
        rating: i.work.rating,
        duration_minutes: i.work.duration_minutes,
        thumbnail_image_url: i.work.thumbnail_image_url,
        status: i.work.status,
        visibility: i.work.visibility,
      } as WorkEntity,
      comment: i.admin_comment ?? "",
    })) ?? [],
  );

  const [themes, setThemes] = useState<{ id: string; name: string }[]>(
    initial?.themes?.map((t) => ({ id: t.id, name: t.name })) ?? [],
  );
  const [nextThemeId, setNextThemeId] = useState(1);

  const addedIds = new Set(orderedItems.map((i) => i.work.id));

  function addTheme(name: string) {
    setThemes((prev) => [...prev, { id: `new-${nextThemeId}`, name }]);
    setNextThemeId((n) => n + 1);
  }

  function removeTheme(id: string) {
    setThemes((prev) => prev.filter((t) => t.id !== id));
  }

  function addWork(work: WorkEntity) {
    if (addedIds.has(work.id)) return;
    setOrderedItems((prev) => [...prev, { work }]);
  }

  function removeWork(workId: string) {
    setOrderedItems((prev) => prev.filter((i) => i.work.id !== workId));
  }

  function updateComment(workId: string, comment: string) {
    setOrderedItems((prev) => prev.map((i) => (i.work.id === workId ? { ...i, comment } : i)));
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    setOrderedItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    setOrderedItems((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  function reorder(from: number, to: number) {
    setOrderedItems((prev) => {
      if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  const totalDuration = orderedItems.reduce((acc, i) => acc + (i.work.duration_minutes || 0), 0);

  function formatApiError(res: { error: string; details?: unknown }): string {
    let msg = res.error;
    const details = res.details as { error?: { details?: { field: string; message: string }[] } } | undefined;
    const items = details?.error?.details;
    if (items && items.length > 0) {
      msg += "\n" + items.map((d) => `• ${d.field}: ${d.message}`).join("\n");
    }
    return msg;
  }

  /**
   * Sincroniza os itens preservando o maior prefixo que já está correto.
   * Antes isto apagava todos os itens e recriava do zero, então uma falha no
   * meio deixava a curadoria mutilada. Agora uma lista inalterada não dispara
   * nenhuma escrita, e qualquer erro aborta nomeando a obra afetada.
   */
  async function syncItems(listId: string) {
    const existing = initial?.items ?? [];

    let keep = 0;
    while (
      keep < existing.length &&
      keep < orderedItems.length &&
      existing[keep].work.id === orderedItems[keep].work.id &&
      (existing[keep].admin_comment ?? "") === (orderedItems[keep].comment ?? "")
    ) {
      keep++;
    }

    for (let i = existing.length - 1; i >= keep; i--) {
      const res = await clientApi.delete(
        `/api/admin/lists/${listId}/items/${existing[i].id}`,
      );
      // 404 = item já removido numa tentativa anterior; retentar tem que passar.
      if (!res.ok && res.status !== 404) {
        throw new Error(
          `Erro ao remover "${existing[i].work.title}" da lista: ${res.error}`,
        );
      }
    }

    for (let i = keep; i < orderedItems.length; i++) {
      const item = orderedItems[i];
      const res = await clientApi.post(`/api/admin/lists/${listId}/items`, {
        work_id: item.work.id,
        admin_comment: item.comment || undefined,
      });
      if (!res.ok) {
        throw new Error(
          `Erro ao adicionar "${item.work.title}" na posição ${i + 1}: ${res.error}`,
        );
      }
    }
  }

  async function handleSubmit(publish?: boolean) {
    setError(null);
    setSubmitting(true);

    try {
      const themeIds: string[] = [];
      for (const theme of themes) {
        if (theme.id.startsWith("new-")) {
          const res = await clientApi.post<ThemeEntity>("/api/admin/themes", {
            name: theme.name,
          });
          if (!res.ok) throw new Error(`Erro ao criar tema "${theme.name}": ${res.error}`);
          themeIds.push(res.data.id);
        } else {
          themeIds.push(theme.id);
        }
      }

      const payload = {
        title,
        description,
        stage: stage || undefined,
        cover_image_url: coverImageUrl || undefined,
        admin_note: adminNote || undefined,
        theme_ids: themeIds,
      };

      let listId = initial?.id;

      if (initial) {
        const res = await clientApi.patch<ListEntity>(
          `/api/admin/lists/${initial.id}`,
          payload,
        );
        if (!res.ok) throw new Error(formatApiError(res));
        listId = initial.id;
      } else {
        const res = await clientApi.post<ListEntity>("/api/admin/lists", payload);
        if (!res.ok) throw new Error(formatApiError(res));
        listId = res.data.id;
      }

      if (listId) {
        await syncItems(listId);

        if (publish) {
          const pubRes = await clientApi.post(`/api/admin/lists/${listId}/publish`);
          if (!pubRes.ok) throw new Error(formatApiError(pubRes));
        }
      }

      router.push("/admin/listas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  const snapshot = JSON.stringify([
    title, stage, description, coverImageUrl, adminNote,
    themes.map((t) => t.name),
    orderedItems.map((i) => [i.work.id, i.comment ?? ""]),
  ]);
  // useState com valor inicial guarda o retrato do primeiro render; ler um
  // ref durante o render seria violação da regra do React.
  const [pristineSnapshot] = useState(snapshot);
  const isDirty = snapshot !== pristineSnapshot;

  function handleDiscard() {
    if (
      isDirty &&
      !window.confirm(
        "Descartar as alterações? A seleção e a ordem das obras serão perdidas.",
      )
    ) {
      return;
    }
    router.push("/admin/listas");
  }

  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  // A API exige title e description em qualquer POST/PATCH de lista.
  const missingRequired = !title.trim() || !description.trim();
  const incompleteHint = "Preencha título e descrição curatorial para salvar.";
  // Publicar uma curadoria vazia não faz sentido para o professor.
  const cannotPublish = missingRequired || orderedItems.length === 0;
  const publishHint = missingRequired
    ? incompleteHint
    : "Adicione ao menos uma obra para publicar a lista.";

  const inputClass =
    "h-[44px] w-full rounded-[12px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow";
  const labelClass =
    "block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light";
  const required = (
    <span className="ml-1 text-destructive" title="Campo obrigatório">
      *<span className="sr-only"> (obrigatório)</span>
    </span>
  );
  const selectClass =
    "h-[44px] rounded-[12px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-base text-cine-50";

  const isEditing = !!initial;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!submitting && !missingRequired) handleSubmit(false);
      }}
      className="flex flex-col gap-[22px]"
    >
      <div className="flex gap-[22px]">
        <div className="w-[508px] shrink-0 rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-[22px] font-bold tracking-[-0.44px] text-cine-50">
              Contexto da lista
            </h2>
            <div className="flex-1 border-t border-[rgba(80,64,107,0.66)]" />
          </div>

          <div className="mt-4 space-y-[14px]">
            <div>
              <label className={labelClass}>Imagem de capa</label>
              <div className="mt-1.5">
                <ImageUpload value={coverImageUrl} onChange={setCoverImageUrl} label="Clique para enviar capa da lista" />
              </div>
            </div>

            <div>
              <label htmlFor="lista-titulo" className={labelClass}>
                Título da lista{required}
              </label>
              <input
                id="lista-titulo"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Infâncias, imaginação e escuta"
                className={inputClass}
              />
            </div>

            <div>
              <label id="lista-etapa-label" className={labelClass}>
                Público indicado
              </label>
              <Select items={STAGE_LABELS} value={stage} onValueChange={(v) => setStage(v ?? "")}>
                <SelectTrigger aria-labelledby="lista-etapa-label" className={selectClass}>
                  <SelectValue placeholder="Selecionar etapa" />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="lista-descricao" className={labelClass}>
                Descrição curatorial{required}
              </label>
              <textarea
                id="lista-descricao"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Três curtas para abrir conversa sobre escuta e convivência nos anos iniciais."
                className="h-[116px] w-full resize-none rounded-[12px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 py-3 text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
              />
            </div>

            <div>
              <label htmlFor="lista-observacoes" className={labelClass}>
                Observações do curador
              </label>
              <textarea
                id="lista-observacoes"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Ex: Assistir na ordem. Reservar 10 min ao fim de cada obra para a roda de conversa."
                className="h-[180px] w-full resize-none rounded-[12px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 py-3 text-base text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
              />
            </div>

            <div>
              <label htmlFor="lista-temas" className={labelClass}>
                Temas principais
              </label>
              <div className="mt-1.5">
                <TagInput
                  inputId="lista-temas"
                  tags={themes}
                  onAdd={addTheme}
                  onRemove={removeTheme}
                  placeholder="Digite um tema..."
                />
              </div>
            </div>

            {orderedItems.length > 0 && (
              <div className="rounded-[16px] bg-[#F9F4EA] px-[18px] py-5">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#260B83]">
                  RESUMO PARA PROFESSORES
                </p>
                <p className="mt-1 text-[14px] font-[560] leading-[20.3px] text-[#181226]">
                  {orderedItems.length} {orderedItems.length === 1 ? "obra" : "obras"} ·{" "}
                  {totalDuration} minutos no total · sequência indicada para{" "}
                  {stage ? stage.toLowerCase() : "uso em sala"}.
                </p>
              </div>
            )}

            {error && (
              <div
                ref={errorRef}
                role="alert"
                className="whitespace-pre-wrap rounded-[10px] border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            {cannotPublish && !error && (
              <p className="text-right text-xs text-cine-300">{publishHint}</p>
            )}

            <div className="flex justify-end gap-[10px] pt-1">
              <button
                type="button"
                onClick={handleDiscard}
                className="inline-flex min-h-[42px] items-center rounded-full border border-[rgba(215,54,39,0.44)] px-4 text-[13px] font-[650] text-[#D73627] transition-colors hover:bg-destructive/10"
              >
                {isEditing ? "Descartar alterações" : "Descartar"}
              </button>
              <button
                type="submit"
                disabled={submitting || missingRequired}
                title={missingRequired ? incompleteHint : undefined}
                className="inline-flex min-h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-4 text-[13px] font-[650] text-cine-50 transition-colors hover:bg-cine-50/10 disabled:opacity-50"
              >
                {submitting ? "Salvando..." : "Salvar rascunho"}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={submitting || cannotPublish}
                title={cannotPublish ? publishHint : undefined}
                className="inline-flex min-h-[42px] items-center rounded-full bg-cine-yellow px-4 text-[13px] font-[650] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark disabled:opacity-50"
              >
                {submitting ? "Publicando..." : "Publicar lista"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-[22px] font-bold tracking-[-0.44px] text-cine-50">
              Selecionar e ordenar obras
            </h2>
            <div className="flex-1 border-t border-[rgba(80,64,107,0.66)]" />
          </div>

          <div className="mt-[6px]">
            <WorkSearch onAdd={addWork} addedIds={addedIds} />
          </div>

          <div className="mt-[18px] flex items-center gap-3">
            <h2 className="font-heading text-[22px] font-bold tracking-[-0.44px] text-cine-50">
              Ordem da lista
            </h2>
            <div className="flex-1 border-t border-[rgba(80,64,107,0.66)]" />
          </div>

          <p className="mt-1 text-[13px] leading-[18.85px] text-cine-200">
            Arraste pela alça para reorganizar a sequência, ou use as setas de cada
            item para mover pelo teclado.
          </p>

          <div className="mt-1">
            <OrderedList
              items={orderedItems}
              onReorder={reorder}
              onRemove={removeWork}
              onComment={updateComment}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
