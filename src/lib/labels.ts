import type {
  InstitutionType,
  ListStatus,
  Rating,
  WorkStatus,
  WorkType,
} from "@/types/api";
import { STAGE_OPTIONS } from "@/lib/stages";

/**
 * Rótulos em português para os valores que a API guarda em inglês.
 *
 * Cada um destes precisa ser passado como `items` no `<Select>`: o
 * `<SelectValue>` do Base UI só consegue mapear valor→rótulo se receber essa
 * tabela; sem ela o gatilho mostra o valor cru ("short", "draft").
 */
export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  short: "Curta-metragem",
  documentary: "Documentário",
  animation: "Animação",
};

/** Versão curta, para cards e tabelas onde o espaço é apertado. */
export const WORK_TYPE_LABELS_SHORT: Record<WorkType, string> = {
  short: "Curta",
  documentary: "Documentário",
  animation: "Animação",
};

export const RATING_LABELS: Record<Rating, string> = {
  L: "Livre",
  "10": "10 anos",
  "12": "12 anos",
  "14": "14 anos",
  "16": "16 anos",
  "18": "18 anos",
};

export const WORK_STATUS_LABELS: Record<WorkStatus, string> = {
  draft: "Revisão",
  published: "Publicado",
  archived: "Arquivado",
};

export const LIST_STATUS_LABELS: Record<ListStatus, string> = {
  draft: "Revisão",
  published: "Publicado",
  archived: "Arquivado",
};

/** Os filtros de status do admin têm uma opção "todos" além dos status reais. */
export const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "Todos os status",
  ...WORK_STATUS_LABELS,
};

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  school: "Escola",
  university: "Universidade",
  cultural_center: "Centro Cultural",
  other: "Outro",
};

export const ADMIN_STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
};

/** Etapas: o valor já é o texto exibido, mas o Select precisa da tabela. */
export const STAGE_LABELS: Record<string, string> = Object.fromEntries(
  STAGE_OPTIONS.map((stage) => [stage, stage]),
);
