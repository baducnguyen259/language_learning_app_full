import { axiosClient } from "@/lib/axios_client";
import type { ApiResponse } from "@/types/api.types";

import type { AdminLoginPayload, AdminLoginResult } from "../types/auth.types";

export async function loginAdmin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResult> {
  const response = await axiosClient.post<ApiResponse<AdminLoginResult>>(
    "/admin/auth/login",
    payload,
  );

  return response.data.data;
}
