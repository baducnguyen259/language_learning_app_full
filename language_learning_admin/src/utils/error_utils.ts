import axios from "axios";

import type { ApiError } from "@/types/api.types";

const DEFAULT_ERROR_MESSAGE = "Đã xảy ra lỗi. Vui lòng thử lại.";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const message = error.response?.data?.error?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    return message ?? error.message ?? DEFAULT_ERROR_MESSAGE;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}
