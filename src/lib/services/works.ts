import { api } from "@/lib/api-client";
import type {
  WorkEntity,
  PaginatedResponse,
  CreateWorkDto,
  UpdateWorkDto,
} from "@/types/api";

export const worksService = {
  listPublic(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<WorkEntity>>("/api/works", { params });
  },

  getBySlug(slug: string) {
    return api.get<WorkEntity>(`/api/works/${slug}`);
  },

  listAdmin(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<WorkEntity>>("/api/admin/works", { params });
  },

  getById(id: string) {
    return api.get<WorkEntity>(`/api/admin/works/${id}`);
  },

  create(data: CreateWorkDto) {
    return api.post<WorkEntity>("/api/admin/works", data);
  },

  update(id: string, data: UpdateWorkDto) {
    return api.patch<WorkEntity>(`/api/admin/works/${id}`, data);
  },

  publish(id: string) {
    return api.post<WorkEntity>(`/api/admin/works/${id}/publish`);
  },

  unpublish(id: string) {
    return api.post<WorkEntity>(`/api/admin/works/${id}/unpublish`);
  },

  archive(id: string) {
    return api.post<WorkEntity>(`/api/admin/works/${id}/archive`);
  },

  duplicate(id: string) {
    return api.post<WorkEntity>(`/api/admin/works/${id}/duplicate`);
  },
};
