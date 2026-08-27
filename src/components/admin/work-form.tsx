"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api-client";
import type {
  CreateWorkDto,
  WorkEntity,
  ThemeEntity,
  BnccSkillEntity,
} from "@/types/api";
import { STAGE_OPTIONS } from "@/lib/stages";
import { TagInput } from "@/components/admin/tag-input";
import { EditorialChecklist } from "@/components/admin/editorial-checklist";
import { ImageUpload } from "@/components/admin/image-upload";
import { BnccSkillsSelector } from "@/components/admin/bncc-skills-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const workTypeLabels: Record<string, string> = {
  short: "Curta-metragem",
  documentary: "Documentário",
  animation: "Animação",
};

// Limite só de orientação: acima disto o texto começa a ser cortado nos cards.
// Não é imposto como maxLength para não truncar sinopse já cadastrada.
const SYNOPSIS_SOFT_LIMIT = 280;

const ratingLabels: Record<string, string> = {
  L: "Livre",
  "10": "10 anos",
  "12": "12 anos",
  "14": "14 anos",
  "16": "16 anos",
  "18": "18 anos",
};

interface WorkFormProps {
  initial?: WorkEntity;
}

export function WorkForm({ initial }: WorkFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState(initial?.type ?? "short");
  const [duration, setDuration] = useState(
    String(initial?.duration_minutes ?? ""),
  );
  const [year, setYear] = useState(String(initial?.release_year ?? ""));
  const [rating, setRating] = useState(initial?.rating ?? "L");

  const [shortDescription, setShortDescription] = useState(initial?.short_description ?? initial?.synopsis ?? "");
  const [stage, setStage] = useState(initial?.stage ?? "");
  const [bnccSkills, setBnccSkills] = useState<BnccSkillEntity[]>(
    initial?.bncc_skills?.map((s) => ({
      id: s.id,
      code: s.code,
      description: s.description,
      area: s.area,
      stage: s.stage,
    })) ?? [],
  );

  const [thumbnailUrl, setThumbnailUrl] = useState(
    initial?.thumbnail_image_url ?? "",
  );
  const [videoUrl, setVideoUrl] = useState(initial?.external_video_url ?? "");
  const [pedagogicalUse, setPedagogicalUse] = useState(
    initial?.pedagogical_use ?? "",
  );
  const [triggerQuestion, setTriggerQuestion] = useState(
    initial?.trigger_question ?? "",
  );

  const [themes, setThemes] = useState<{ id: string; name: string }[]>(
    initial?.themes?.map((t) => ({ id: t.id, name: t.name })) ?? [],
  );
  const [nextThemeId, setNextThemeId] = useState(1);

  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  function addTheme(name: string) {
    setThemes((prev) => [...prev, { id: `new-${nextThemeId}`, name }]);
    setNextThemeId((n) => n + 1);
  }

  function removeTheme(id: string) {
    setThemes((prev) => prev.filter((t) => t.id !== id));
  }

  function addBnccSkill(skill: BnccSkillEntity) {
    setBnccSkills((prev) => [...prev, skill]);
  }

  function removeBnccSkill(id: string) {
    setBnccSkills((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleChecklist(id: string) {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function formatApiError(res: { error: string; details?: unknown }): string {
    let msg = res.error;
    const details = res.details as
      | { error?: { details?: { field: string; message: string }[] } }
      | undefined;
    const items = details?.error?.details;
    if (items && items.length > 0) {
      msg += "\n" + items.map((d) => `• ${d.field}: ${d.message}`).join("\n");
    }
    return msg;
  }

  async function handleSubmit(status: "draft" | "published") {
    setError(null);
    setSubmitting(true);

    try {
      // `Number("12 min")` é NaN, que o JSON.stringify manda como null e o
      // backend rejeita com uma mensagem em inglês. Parseia e valida aqui.
      const durationMinutes = Number.parseInt(duration, 10);
      if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
        throw new Error("Informe a duração da obra em minutos (ex: 12).");
      }

      const releaseYear = year.trim() ? Number.parseInt(year, 10) : undefined;
      if (releaseYear !== undefined && !Number.isFinite(releaseYear)) {
        throw new Error("Ano de lançamento inválido. Use quatro dígitos (ex: 2024).");
      }

      const themeIds: string[] = [];
      for (const theme of themes) {
        if (theme.id.startsWith("new-")) {
          const res = await clientApi.post<ThemeEntity>("/api/admin/themes", {
            name: theme.name,
          });
          if (!res.ok)
            throw new Error(`Erro ao criar tema "${theme.name}": ${res.error}`);
          themeIds.push(res.data.id);
        } else {
          themeIds.push(theme.id);
        }
      }

      const payload: CreateWorkDto = {
        title,
        type: type as CreateWorkDto["type"],
        duration_minutes: durationMinutes,
        release_year: releaseYear,
        rating: rating as CreateWorkDto["rating"],
        short_description: shortDescription || undefined,
        synopsis: shortDescription,
        stage: stage || undefined,
        thumbnail_image_url: thumbnailUrl || undefined,
        external_video_url: videoUrl || undefined,
        pedagogical_use: pedagogicalUse || undefined,
        trigger_question: triggerQuestion || undefined,
        theme_ids: themeIds.length > 0 ? themeIds : undefined,
        bncc_skill_ids:
          bnccSkills.length > 0 ? bnccSkills.map((s) => s.id) : undefined,
      };

      let workId = initial?.id;

      if (initial) {
        const res = await clientApi.patch<WorkEntity>(
          `/api/admin/works/${initial.id}`,
          payload,
        );
        if (!res.ok) throw new Error(res.error ?? "Erro ao atualizar obra");
        workId = initial.id;
      } else {
        const res = await clientApi.post<WorkEntity>(
          "/api/admin/works",
          payload,
        );
        if (!res.ok) throw new Error(res.error ?? "Erro ao criar obra");
        workId = res.data.id;
      }

      if (status === "published" && workId) {
        const pubRes = await clientApi.post(
          `/api/admin/works/${workId}/publish`,
        );
        if (!pubRes.ok) throw new Error(formatApiError(pubRes));
      }

      router.push("/admin/obras");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  // O bloco de erro fica no rodapé; sem isto o usuário clica em publicar numa
  // tela alta e nada parece ter acontecido.
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  // Mínimo que a API exige em qualquer POST/PATCH de obra (title, synopsis,
  // type, duration_minutes, rating) — type e rating já têm valor padrão.
  const missingRequired =
    !title.trim() || !duration.trim() || !shortDescription.trim();
  const incompleteHint =
    "Preencha título, duração e sinopse curta para salvar.";
  const synopsisTooLong = shortDescription.length > SYNOPSIS_SOFT_LIMIT;

  const inputClass =
    "h-[44px] w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow";
  const labelClass =
    "block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light";
  const required = (
    <span className="ml-1 text-destructive" title="Campo obrigatório">
      *<span className="sr-only"> (obrigatório)</span>
    </span>
  );
  const selectClass =
    "h-[44px] rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 text-sm text-cine-50";

  const isEditing = !!initial;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!submitting && !missingRequired) handleSubmit("draft");
      }}
      className="flex flex-col gap-[18px]"
    >
      <div className="grid grid-cols-[1fr_340px] gap-[18px]">
        <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
          {/* Seção 1: Identificação da obra */}
          <div>
            <div className="flex items-center gap-4">
              <h2 className="font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
                Identificação da obra
              </h2>
              <div className="flex-1 border-t border-[rgba(80,64,107,0.74)]" />
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="obra-titulo" className={labelClass}>
                  Título{required}
                </label>
                <input
                  id="obra-titulo"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O menino que engoliu o choro"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label id="obra-tipo-label" className={labelClass}>
                    Tipo
                  </label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v ?? "short")}
                  >
                    <SelectTrigger aria-labelledby="obra-tipo-label" className={selectClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(workTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="obra-duracao" className={labelClass}>
                    Duração (minutos){required}
                  </label>
                  <input
                    id="obra-duracao"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    inputMode="numeric"
                    placeholder="Ex: 12"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="obra-ano" className={labelClass}>
                    Ano de lançamento
                  </label>
                  <input
                    id="obra-ano"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    inputMode="numeric"
                    placeholder="Ex: 2024"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label id="obra-rating-label" className={labelClass}>
                    Classificação indicativa
                  </label>
                  <Select
                    value={rating}
                    onValueChange={(v) => setRating(v ?? "L")}
                  >
                    <SelectTrigger aria-labelledby="obra-rating-label" className={selectClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ratingLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Imagens e exibição */}
          <div className="mt-8 border-t border-[rgba(80,64,107,0.74)] pt-8">
            <div className="flex items-center gap-4">
              <h2 className="font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
                Imagens e exibição
              </h2>
              <div className="flex-1 border-t border-[rgba(80,64,107,0.74)]" />
            </div>

            <div className="mt-5">
              <ImageUpload
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                label="Clique para enviar a capa do curta"
              />
              <p className="mt-2 text-xs leading-[16.8px] text-cine-300">
                Use um frame real da obra em proporção 16:9 — é assim que ela
                aparece nos cards do acervo.
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="obra-video" className={labelClass}>
                URL de exibição
              </label>
              <input
                id="obra-video"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ex: https://www.youtube.com/watch?v=..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Seção 3: Curadoria pedagógica */}
          <div className="mt-8 border-t border-[rgba(80,64,107,0.74)] pt-8">
            <div className="flex items-center gap-4">
              <h2 className="font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
                Curadoria pedagógica
              </h2>
              <div className="flex-1 border-t border-[rgba(80,64,107,0.74)]" />
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="obra-sinopse" className={labelClass}>
                  Sinopse curta{required}
                </label>
                <textarea
                  id="obra-sinopse"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Ex: Um menino descobre que guardar o choro tem peso, e aprende a dividi-lo."
                  aria-describedby="obra-sinopse-ajuda"
                  className="h-[112px] w-full resize-none rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 py-2 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
                />
                <div
                  id="obra-sinopse-ajuda"
                  className="mt-1 flex items-baseline justify-between gap-3 text-xs text-cine-300"
                >
                  <span>Aparece nos cards do acervo e na página da obra.</span>
                  <span className={synopsisTooLong ? "text-cine-yellow" : undefined}>
                    {shortDescription.length}
                    {synopsisTooLong && ` · passa de ${SYNOPSIS_SOFT_LIMIT}, o card vai cortar`}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="obra-uso" className={labelClass}>
                  Uso pedagógico
                </label>
                <textarea
                  id="obra-uso"
                  value={pedagogicalUse}
                  onChange={(e) => setPedagogicalUse(e.target.value)}
                  placeholder="Ex: Abrir a aula com a cena do silêncio e pedir que a turma nomeie o que sentiu."
                  className="h-[100px] w-full resize-none rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 py-2 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
                />
              </div>

              <div>
                <label htmlFor="obra-pergunta" className={labelClass}>
                  Pergunta disparadora
                </label>
                <textarea
                  id="obra-pergunta"
                  value={triggerQuestion}
                  onChange={(e) => setTriggerQuestion(e.target.value)}
                  placeholder="Que pergunta ajuda os alunos a se conectar com a obra?"
                  className="h-[80px] w-full resize-none rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] px-3 py-2 text-sm text-cine-50 outline-none placeholder:text-cine-300 focus:border-cine-yellow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label id="obra-etapa-label" className={labelClass}>
                    Etapa sugerida
                  </label>
                  <Select
                    value={stage}
                    onValueChange={(v) => setStage(v ?? "")}
                  >
                    <SelectTrigger aria-labelledby="obra-etapa-label" className={selectClass}>
                      <SelectValue placeholder="Selecione uma etapa" />
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
                  <label htmlFor="obra-bncc" className={labelClass}>
                    Habilidades BNCC
                  </label>
                  <div className="mt-1.5">
                    <BnccSkillsSelector
                      inputId="obra-bncc"
                      selected={bnccSkills}
                      onAdd={addBnccSkill}
                      onRemove={removeBnccSkill}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="obra-temas" className={labelClass}>
                  Temas
                </label>
                <div className="mt-1.5">
                  <TagInput
                    inputId="obra-temas"
                    tags={themes}
                    onAdd={addTheme}
                    onRemove={removeTheme}
                    placeholder="Digite um tema..."
                  />
                </div>
                <p className="mt-2 text-xs leading-[16.8px] text-cine-300">
                  Adicione quantos temas forem necessários. Ex: Emoções, Cultura
                  brasileira, Infância, Leitura de imagem, Natureza etc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-[18px]">
          {/* Status do cadastro card */}
          <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light">
              Status do cadastro
            </span>
            <p className="mt-4 font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
              {isEditing ? "Em edição" : "Rascunho em revisão"}
            </p>
          </div>

          <EditorialChecklist checked={checklist} onToggle={toggleChecklist} />
        </div>
      </div>

      {/* Action buttons */}
      {error && (
        <div
          ref={errorRef}
          role="alert"
          className="whitespace-pre-wrap rounded-[10px] border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {missingRequired && !error && (
        <p className="text-right text-xs text-cine-300">{incompleteHint}</p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/obras")}
          className="inline-flex h-[42px] items-center rounded-full border border-destructive/50 px-5 text-sm font-[650] text-destructive transition-colors hover:bg-destructive/10"
        >
          Descartar
        </button>
        <button
          type="submit"
          disabled={submitting || missingRequired}
          title={missingRequired ? incompleteHint : undefined}
          className="inline-flex h-[42px] items-center rounded-full border border-[rgba(248,245,239,0.22)] px-5 text-sm font-[650] text-cine-50 transition-colors hover:bg-cine-50/10 disabled:opacity-50"
        >
          {submitting ? "Salvando..." : "Salvar rascunho"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("published")}
          disabled={submitting || missingRequired}
          title={missingRequired ? incompleteHint : undefined}
          className="inline-flex h-[42px] items-center rounded-full bg-cine-yellow px-5 text-sm font-[650] text-cine-text-dark transition-colors hover:bg-cine-yellow-dark disabled:opacity-50"
        >
          {submitting ? "Publicando..." : "Enviar para publicação"}
        </button>
      </div>
    </form>
  );
}
