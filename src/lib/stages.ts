/**
 * Valores de etapa aceitos pela API.
 *
 * Precisam bater caractere a caractere entre o cadastro de obra, o cadastro de
 * lista e os filtros públicos (`/obras?stage=`, `/curadorias?stage=`), que
 * comparam por igualdade exata. Divergir na acentuação ou na caixa faz o
 * registro sumir do filtro correspondente.
 */
export const STAGE_OPTIONS = [
  "Educação Infantil",
  "Anos iniciais",
  "Anos finais",
  "Ensino Fundamental",
  "Ensino médio",
] as const;

export type Stage = (typeof STAGE_OPTIONS)[number];
