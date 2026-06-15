import { api } from "@/lib/api-client";
import type { UploadResult } from "@/types/api";

export const uploadService = {
  upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<UploadResult>("/api/admin/uploads", formData);
  },
};
