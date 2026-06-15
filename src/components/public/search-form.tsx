"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("q", trimmed);
    params.delete("page");
    router.push(`/obras?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="flex flex-1 items-center gap-3 rounded-full bg-cine-50 px-5 py-3.5">
        <svg
          width="20"
          height="22"
          viewBox="0 0 20 22"
          fill="none"
          className="shrink-0 text-cine-400"
        >
          <path
            d="M16.6774 18.1476L13.2227 14.693M14.2949 10.603C14.2949 13.452 11.9818 15.7651 9.13279 15.7651C6.28376 15.7651 3.9707 13.452 3.9707 10.603C3.9707 7.75397 6.28376 5.44092 9.13279 5.44092C11.9818 5.44092 14.2949 7.75397 14.2949 10.603L16.6774 18.1476"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar no acervo"
          className="flex-1 bg-transparent text-sm text-cine-text-dark outline-none placeholder:text-[#868390]"
        />
      </div>
      <button
        type="submit"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cine-yellow"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-cine-text-dark"
        >
          <path
            d="M5 12H18M18 12L13 7M18 12L13 17"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
