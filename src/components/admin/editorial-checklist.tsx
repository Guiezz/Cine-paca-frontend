"use client";

import { Checkbox } from "@/components/ui/checkbox";

const checklistItems = [
  {
    id: "exibicao",
    title: "Direitos de exibição",
    description: "Confirme se a obra está liberada para uso educacional gratuito.",
  },
  {
    id: "classificacao",
    title: "Classificação",
    description: "A indicação etária precisa estar clara antes de publicar.",
  },
  {
    id: "bncc",
    title: "BNCC",
    description:
      "Habilidades da BNCC associadas ajudam professores a justificar o uso da obra em sala de aula.",
  },
  {
    id: "imagem",
    title: "Imagem",
    description: "Prefira frame real da obra, com boa leitura em cards horizontais.",
  },
];

interface EditorialChecklistProps {
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export function EditorialChecklist({ checked, onToggle }: EditorialChecklistProps) {
  return (
    <div className="rounded-[18px] border border-[rgba(80,64,107,0.74)] bg-[#201337] p-6">
      <h2 className="font-heading text-[22px] font-bold tracking-[-0.66px] text-cine-50">
        Checklist editorial
      </h2>
      <div className="mt-5 space-y-4">
        {checklistItems.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer gap-3"
          >
            <Checkbox
              checked={checked[item.id] ?? false}
              onCheckedChange={() => onToggle(item.id)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-cine-50">{item.title}</p>
              <p className="text-xs leading-[16.8px] text-cine-200">{item.description}</p>
            </div>
          </label>
        ))}
      </div>
      <p className="mt-4 text-xs text-cine-300">
        Itens não obrigatórios, mas recomendados antes de publicar.
      </p>
    </div>
  );
}
