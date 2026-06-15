import { api } from "@/lib/api-client";
import type {
  InstitutionEntity,
  PaginatedResponse,
  CreateInstitutionDto,
  UpdateInstitutionDto,
} from "@/types/api";

export const institutionsService = {
  list(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<InstitutionEntity>>("/api/institutions", { params });
  },

  listAdmin(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<InstitutionEntity>>("/api/admin/institutions", { params });
  },

  getById(id: string) {
    return api.get<InstitutionEntity>(`/api/admin/institutions/${id}`);
  },

  create(data: CreateInstitutionDto) {
    return api.post<InstitutionEntity>("/api/admin/institutions", data);
  },

  update(id: string, data: UpdateInstitutionDto) {
    return api.patch<InstitutionEntity>(`/api/admin/institutions/${id}`, data);
  },

  delete(id: string) {
    return api.delete<void>(`/api/admin/institutions/${id}`);
  },
};
