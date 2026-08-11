import type { ApiResponse, PaginatedData } from "@/types/api.types";
import type { Language, LanguageFilters } from "../types/language.types";
import { axiosClient } from "@/lib/axios_client";

export const LANGUAGE_API_PATH = "/languages";

export async function getLanguages(
  filters: LanguageFilters = {},
): Promise<PaginatedData<Language>> {
  const response = await axiosClient.get<ApiResponse<PaginatedData<Language>>>(
    LANGUAGE_API_PATH,
    { params: filters },
  );
  return response.data.data;
}
