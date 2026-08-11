import type { ApiResponse, PaginatedData } from "@/types/api.types";
import type { Level, LevelFilters } from "../types/level.types";
import { axiosClient } from "@/lib/axios_client";

export const LEVEL_API_PATH = "/admin/levels";

export async function getLevels(
  filters: LevelFilters = {},
): Promise<PaginatedData<Level>> {
  const response = await axiosClient.get<ApiResponse<PaginatedData<Level>>>(
    LEVEL_API_PATH,
    {
      params: filters,
    },
  );
  return response.data.data;
}
