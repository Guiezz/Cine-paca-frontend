import { api } from "@/lib/api-client";
import type { HealthEntity } from "@/types/api";

export const healthService = {
  check() {
    return api.get<HealthEntity>("/api/health");
  },
};
