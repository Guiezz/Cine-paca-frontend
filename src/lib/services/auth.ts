import { api } from "@/lib/api-client";
import type {
  LoginDto,
  AuthTokensResponse,
  RefreshTokensResponse,
  MeResponse,
  ChangePasswordDto,
  AdminEntity,
  PaginatedResponse,
  CreateAdminDto,
  UpdateAdminDto,
} from "@/types/api";

export const authService = {
  login(data: LoginDto) {
    return api.post<AuthTokensResponse>("/api/auth/login", data);
  },

  logout() {
    return api.post<void>("/api/auth/logout");
  },

  refresh() {
    return api.post<RefreshTokensResponse>("/api/auth/refresh");
  },

  me() {
    return api.get<MeResponse>("/api/auth/me");
  },

  changePassword(data: ChangePasswordDto) {
    return api.post<void>("/api/auth/change-password", data);
  },

  listAdmins(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<AdminEntity>>("/api/admin/admins", { params });
  },

  getAdmin(id: string) {
    return api.get<AdminEntity>(`/api/admin/admins/${id}`);
  },

  createAdmin(data: CreateAdminDto) {
    return api.post<AdminEntity>("/api/admin/admins", data);
  },

  updateAdmin(id: string, data: UpdateAdminDto) {
    return api.patch<AdminEntity>(`/api/admin/admins/${id}`, data);
  },
};
