import { axiosClient } from "@/lib/axios_client";
import type { ApiResponse, PaginatedData } from "@/types/api.types";

import type {
  AssignLessonPayload,
  ChapterLesson,
  CreateChapterPayload,
  CreateCurriculumPayload,
  Curriculum,
  CurriculumChapter,
  CurriculumFilters,
  UpdateChapterPayload,
  UpdateCurriculumPayload,
} from "../types/curriculum.types";

const CURRICULUM_API_PATH = "/admin/curriculums";

export async function getCurriculums(
  filters: CurriculumFilters,
): Promise<PaginatedData<Curriculum>> {
  const response = await axiosClient.get<
    ApiResponse<PaginatedData<Curriculum>>
  >(CURRICULUM_API_PATH, {
    params: filters,
  });

  return response.data.data;
}

export async function getCurriculum(id: string): Promise<Curriculum> {
  const response = await axiosClient.get<ApiResponse<Curriculum>>(
    `${CURRICULUM_API_PATH}/${id}`,
  );

  return response.data.data;
}

export async function createCurriculum(
  payload: CreateCurriculumPayload,
): Promise<Curriculum> {
  const response = await axiosClient.post<ApiResponse<Curriculum>>(
    CURRICULUM_API_PATH,
    payload,
  );

  return response.data.data;
}

export async function updateCurriculum(
  id: string,
  payload: UpdateCurriculumPayload,
): Promise<Curriculum> {
  const response = await axiosClient.patch<ApiResponse<Curriculum>>(
    `${CURRICULUM_API_PATH}/${id}`,
    payload,
  );

  return response.data.data;
}

export async function deleteCurriculum(id: string): Promise<void> {
  await axiosClient.delete(`${CURRICULUM_API_PATH}/${id}`);
}

export async function createChapter(
  curriculumId: string,
  payload: CreateChapterPayload,
): Promise<CurriculumChapter> {
  const response = await axiosClient.post<ApiResponse<CurriculumChapter>>(
    `${CURRICULUM_API_PATH}/${curriculumId}/chapters`,
    payload,
  );

  return response.data.data;
}

export async function updateChapter(
  curriculumId: string,
  chapterId: string,
  payload: UpdateChapterPayload,
): Promise<CurriculumChapter> {
  const response = await axiosClient.patch<ApiResponse<CurriculumChapter>>(
    `${CURRICULUM_API_PATH}/${curriculumId}/chapters/${chapterId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteChapter(
  curriculumId: string,
  chapterId: string,
): Promise<void> {
  await axiosClient.delete(
    `${CURRICULUM_API_PATH}/${curriculumId}/chapters/${chapterId}`,
  );
}

export async function assignLessonToChapter(
  curriculumId: string,
  chapterId: string,
  payload: AssignLessonPayload,
): Promise<ChapterLesson> {
  const response = await axiosClient.post<ApiResponse<ChapterLesson>>(
    `${CURRICULUM_API_PATH}/${curriculumId}/chapters/${chapterId}/lessons`,
    payload,
  );

  return response.data.data;
}

export async function removeLessonFromChapter(
  curriculumId: string,
  chapterId: string,
  lessonId: string,
): Promise<ChapterLesson> {
  const response = await axiosClient.delete<ApiResponse<ChapterLesson>>(
    `${CURRICULUM_API_PATH}/${curriculumId}/chapters/${chapterId}/lessons/${lessonId}`,
  );

  return response.data.data;
}
