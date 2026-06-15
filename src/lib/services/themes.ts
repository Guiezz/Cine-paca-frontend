import { api } from "@/lib/api-client";
import type { ThemeEntity, PaginatedResponse, CreateThemeDto, UpdateThemeDto } from "@/types/api";

export const themesService = {
  list(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<ThemeEntity>>("/api/themes", { params });
  },

  listAdmin(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<ThemeEntity>>("/api/admin/themes", { params });
  },

  getById(id: string) {
    return api.get<ThemeEntity>(`/api/admin/themes/${id}`);
  },

  create(data: CreateThemeDto) {
    return api.post<ThemeEntity>("/api/admin/themes", data);
  },

  update(id: string, data: UpdateThemeDto) {
    return api.patch<ThemeEntity>(`/api/admin/themes/${id}`, data);
  },

  delete(id: string) {
    return api.delete<void>(`/api/admin/themes/${id}`);
  },
};
