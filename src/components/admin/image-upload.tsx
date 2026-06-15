"use client";

import { useRef, useState } from "react";
import { clientApi } from "@/lib/api-client";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await clientApi.post<{ url: string }>("/api/admin/uploads", formData);
      if (res.ok) {
        onChange(res.data.url);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      className="relative flex h-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-[16px] border border-[rgba(170,147,249,0.34)] bg-[rgba(29,17,48,0.42)] transition-colors hover:border-cine-yellow/50"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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
          <img
            src={value}
            alt="Capa"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-cine-950/70 text-cine-50 hover:bg-cine-950"
          >
            <X className="size-4" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <Upload className="size-6 text-cine-300" />
          <p className="text-sm text-cine-300">
            {label ?? "Clique para enviar imagem"}
          </p>
        </div>
      )}
    </div>
  );
}
