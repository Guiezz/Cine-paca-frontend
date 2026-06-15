import { api } from "@/lib/api-client";
import type { PaginatedResponse, AuditLogEntity } from "@/types/api";

export const auditService = {
  list(params?: Record<string, string | number | boolean | undefined>) {
    return api.get<PaginatedResponse<AuditLogEntity>>("/api/admin/audit", { params });
  },
};
