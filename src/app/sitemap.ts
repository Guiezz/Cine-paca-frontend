import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { listsService, worksService } from "@/lib/services";
import type { ListEntity, WorkEntity } from "@/types/api";

/** A API recusa per_page acima de 50. */
const PER_PAGE = 50;
/** Teto de segurança para o sitemap não virar um laço infinito de páginas. */
const MAX_PAGES = 20;

async function collect<T>(
  fetchPage: (page: number) => Promise<{ items: T[]; totalPages: number }>,
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= MAX_PAGES) {
    const { items, totalPages: total } = await fetchPage(page);
    all.push(...items);
    totalPages = total;
    page += 1;
  }

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/obras"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/curadorias"), changeFrequency: "weekly", priority: 0.8 },
  ];

  // O sitemap não pode derrubar o build se a API estiver fora do ar: nesse
  // caso ele sai só com as rotas fixas.
  let works: WorkEntity[] = [];
  let lists: ListEntity[] = [];

  try {
    works = await collect<WorkEntity>(async (page) => {
      const res = await worksService.listPublic({ page, per_page: PER_PAGE });
      if (!res.ok) return { items: [], totalPages: 0 };
      return { items: res.data.data, totalPages: res.data.pagination.total_pages };
    });
  } catch {
    works = [];
  }

  try {
    lists = await collect<ListEntity>(async (page) => {
      const res = await listsService.listPublic({ page, per_page: PER_PAGE });
      if (!res.ok) return { items: [], totalPages: 0 };
      return { items: res.data.data, totalPages: res.data.pagination.total_pages };
    });
  } catch {
    lists = [];
  }

  return [
    ...staticRoutes,
    ...works.map((work) => ({
      url: absoluteUrl(`/obras/${work.slug}`),
      lastModified: work.updated_at ? new Date(work.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...lists.map((list) => ({
      url: absoluteUrl(`/curadorias/${list.slug}`),
      lastModified: list.updated_at ? new Date(list.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
