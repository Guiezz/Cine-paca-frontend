"use client";

import { useRef, useState } from "react";
import { clientApi } from "@/lib/api-client";
import { Upload, X, Loader2, RefreshCw } from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickFile() {
    if (!uploading) inputRef.current?.click();
  }

  function resetInput() {
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Formato não aceito. Envie JPG, PNG, WebP ou AVIF.");
      resetInput();
      return;
    }

    if (file.size > MAX_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      setError(`A imagem tem ${mb} MB e o limite é 5 MB. Reduza antes de enviar.`);
      resetInput();
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await clientApi.post<{ url: string }>("/api/admin/uploads", formData);
      if (res.ok) {
        onChange(res.data.url);
      } else {
        // Antes o erro era descartado em silêncio: o spinner sumia e nada
        // acontecia, sem o curador entender que o envio falhou.
        setError(res.error || "Não foi possível enviar a imagem. Tente de novo.");
      }
    } finally {
      setUploading(false);
      resetInput();
    }
  }

  return (
    <div>
      <div className="relative flex aspect-video w-full max-w-[440px] items-center justify-center overflow-hidden rounded-[16px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)]">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFile}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-cine-yellow" />
            <p className="text-sm text-cine-300">Enviando...</p>
          </div>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Pré-visualização da capa" className="h-full w-full object-cover" />
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                type="button"
                onClick={pickFile}
                aria-label="Trocar imagem"
                title="Trocar imagem"
                className="flex size-7 items-center justify-center rounded-full bg-cine-950/70 text-cine-50 hover:bg-cine-950"
              >
                <RefreshCw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  onChange("");
                }}
                aria-label="Remover imagem"
                title="Remover imagem"
                className="flex size-7 items-center justify-center rounded-full bg-cine-950/70 text-cine-50 hover:bg-cine-950"
              >
                <X className="size-4" />
              </button>
            </div>
          </>
        ) : (
          // Um <button> de verdade: antes era uma <div onClick>, inalcançável
          // por teclado.
          <button
            type="button"
            onClick={pickFile}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 px-6 text-center transition-colors hover:bg-cine-50/5"
          >
            <Upload className="size-6 text-cine-300" />
            <span className="text-sm text-cine-300">{label ?? "Clique para enviar imagem"}</span>
            <span className="text-xs text-cine-300/70">JPG, PNG, WebP ou AVIF · até 5 MB · 16:9</span>
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
