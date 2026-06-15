import { api } from "@/lib/api-client";
import type { BnccSkillEntity, PaginatedResponse, CreateBnccDto, UpdateBnccDto } from "@/types/api";

export const bnccService = {
  list(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<BnccSkillEntity>>("/api/bncc", { params });
  },

  listAdmin(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<BnccSkillEntity>>("/api/admin/bncc", { params });
  },

  getById(id: string) {
    return api.get<BnccSkillEntity>(`/api/admin/bncc/${id}`);
  },

  create(data: CreateBnccDto) {
    return api.post<BnccSkillEntity>("/api/admin/bncc", data);
  },

  update(id: string, data: UpdateBnccDto) {
    return api.patch<BnccSkillEntity>(`/api/admin/bncc/${id}`, data);
  },

  delete(id: string) {
    return api.delete<void>(`/api/admin/bncc/${id}`);
  },
};
