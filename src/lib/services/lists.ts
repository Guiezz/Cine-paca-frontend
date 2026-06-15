import { api } from "@/lib/api-client";
import type {
  ListEntity,
  PaginatedResponse,
  CreateListDto,
  UpdateListDto,
  AddListItemDto,
  ReorderItemsDto,
} from "@/types/api";

export const listsService = {
  listPublic(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<ListEntity>>("/api/lists", { params });
  },

  getBySlug(slug: string) {
    return api.get<ListEntity>(`/api/lists/${slug}`);
  },

  listAdmin(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<ListEntity>>("/api/admin/lists", { params });
  },

  getById(id: string) {
    return api.get<ListEntity>(`/api/admin/lists/${id}`);
  },

  create(data: CreateListDto) {
    return api.post<ListEntity>("/api/admin/lists", data);
  },

  update(id: string, data: UpdateListDto) {
    return api.patch<ListEntity>(`/api/admin/lists/${id}`, data);
  },

  publish(id: string) {
    return api.post<ListEntity>(`/api/admin/lists/${id}/publish`);
  },

  unpublish(id: string) {
    return api.post<ListEntity>(`/api/admin/lists/${id}/unpublish`);
  },

  archive(id: string) {
    return api.post<ListEntity>(`/api/admin/lists/${id}/archive`);
  },

  addItem(id: string, data: AddListItemDto) {
    return api.post<ListEntity>(`/api/admin/lists/${id}/items`, data);
  },

  reorderItems(id: string, data: ReorderItemsDto) {
    return api.patch<ListEntity>(`/api/admin/lists/${id}/items/reorder`, data);
  },

  removeItem(id: string, itemId: string) {
    return api.delete<ListEntity>(`/api/admin/lists/${id}/items/${itemId}`);
  },
};
