import { cva } from "class-variance-authority";

/**
 * Fonte única dos controles de formulário do admin.
 *
 * Antes cada tela repetia a própria string de classes, e elas divergiram:
 * havia 2 variações de input, 5 de textarea e 16 de botão — com raio, tamanho
 * de texto e cor de destaque diferentes para o mesmo papel. Três lacunas de
 * comportamento vinham junto: select sem nenhum estilo de foco, botão sem
 * anel de foco visível, e `disabled` aplicado só em parte dos casos.
 */

const FIELD_BASE =
  "w-full rounded-[10px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] text-sm text-cine-50 outline-none transition-colors placeholder:text-cine-300 focus:border-cine-yellow focus:ring-2 focus:ring-cine-yellow/25 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive";

/** Input de uma linha. */
export const adminInput = cva(`h-[44px] ${FIELD_BASE}`, {
  variants: {
    icon: {
      none: "px-3",
      /** Campo de busca com lupa à esquerda. */
      left: "pl-9 pr-3",
    },
  },
  defaultVariants: { icon: "none" },
});

/**
 * Gatilho do Select. Precisa das mesmas classes de foco: por renderizar um
 * <button>, ele não herdava nada do input e ficava sem indicação de foco.
 */
export const adminSelectTrigger = cva(`h-[44px] px-3 ${FIELD_BASE}`);

/** Textarea. A altura varia por campo, então vem por `size`. */
export const adminTextarea = cva(`resize-none px-3 py-2 ${FIELD_BASE}`, {
  variants: {
    size: {
      sm: "h-[80px]",
      md: "h-[112px]",
      lg: "h-[180px]",
    },
  },
  defaultVariants: { size: "md" },
});

/** Rótulo de campo. */
export const adminLabel = cva(
  "block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cine-yellow-light",
);

/** Texto de apoio abaixo de um campo. A margem fica com quem usa, porque
 *  varia por caso e o cva não faz merge de classes conflitantes. */
export const adminHint = cva("text-xs leading-[16.8px] text-cine-300");

/** Botão de ação. */
export const adminButton = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full font-[650] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-cine-900 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-cine-yellow text-cine-text-dark hover:bg-cine-yellow-dark",
        secondary:
          "border border-[rgba(248,245,239,0.22)] text-cine-50 hover:bg-cine-50/10",
        destructive:
          "border border-destructive/50 text-destructive hover:bg-destructive/10",
      },
      size: {
        md: "min-h-[42px] px-5 text-sm",
        /** Mais denso, para ações dentro de tabelas e cartões. */
        sm: "min-h-[42px] px-4 text-[13px]",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);
