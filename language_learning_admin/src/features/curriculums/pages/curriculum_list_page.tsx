import AddIcon from "@mui/icons-material/Add";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { SearchInput } from "@/components/forms/search_input";
import { EmptyView } from "@/components/feedback/empty_view";
import { AppPagination } from "@/components/tables/app_pagination";
import { formatDate } from "@/utils/date_utils";
import { getCurriculums } from "../api/curriculum_api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ErrorView } from "@/components/feedback/error_view";
import { LoadingView } from "@/components/feedback/loading_view";
import type { CurriculumFilters as ApiCurriculumFilters } from "../types/curriculum.types";
import { getLanguages } from "@/features/languages";
import { getLevels } from "@/features/levels/api/level_api";

type CurriculumFormFilters = {
  keyword: string;
  language: string;
  level: string;
  status: string;
};

const initialFilters: CurriculumFormFilters = {
  keyword: "",
  language: "all",
  level: "all",
  status: "all",
};

export function CurriculumListPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const languagesQuery = useQuery({
    queryKey: ["admin-languages", "curriculum-filter"],
    queryFn: () =>
      getLanguages({
        page: 1,
        limit: 100,
      }),
  });

  const selectedLanguageId =
    filters.language === "all" ? undefined : filters.language;

  const levelsQuery = useQuery({
    queryKey: ["admin-levels", "curriculum-filter", selectedLanguageId],
    queryFn: () =>
      getLevels({
        languageId: selectedLanguageId,
        page: 1,
        limit: 100,
      }),
  });

  const languages = languagesQuery.data?.items ?? [];
  const levels = levelsQuery.data?.items ?? [];

  const status =
    appliedFilters.status === "published"
      ? "PUBLISHED"
      : appliedFilters.status === "draft"
        ? "DRAFT"
        : undefined;

  const queryFilters: ApiCurriculumFilters = {
    search: appliedFilters.keyword.trim() || undefined,

    languageId:
      appliedFilters.language === "all" ? undefined : appliedFilters.language,

    levelId: appliedFilters.level === "all" ? undefined : appliedFilters.level,
    status,
    page,
    limit: 10,
  };
  const curriculumsQuery = useQuery({
    queryKey: ["admin-curriculums", queryFilters],
    queryFn: () => getCurriculums(queryFilters),
    placeholderData: keepPreviousData,
  });

  const curriculums = curriculumsQuery.data?.items ?? [];
  const pagination = curriculumsQuery.data?.meta;

  function updateFilter(field: keyof CurriculumFormFilters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(1);
  }

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              color: "#20202a",
              fontSize: { xs: 24, sm: 28 },
              lineHeight: 1.25,
              fontWeight: 750,
            }}
          >
            Quản lý lộ trình
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
            Quản lý cấp độ, chương và bài học
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            minHeight: 42,
            px: 2.5,
            alignSelf: { xs: "flex-start", sm: "center" },
          }}
        >
          Thêm lộ trình
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Grid container spacing={1.5} sx={{ alignItems: "flex-end" }}>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Tìm kiếm</FilterLabel>
            <SearchInput
              fullWidth
              value={filters.keyword}
              onSearchChange={(value) => updateFilter("keyword", value)}
              placeholder="Tìm kiếm..."
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Ngôn ngữ</FilterLabel>
            <FilterSelect
              value={filters.language}
              onChange={(value) => {
                setFilters((current) => ({
                  ...current,
                  language: value,
                  level: "all",
                }));
              }}
            >
              <MenuItem value="all">Tất cả ngôn ngữ</MenuItem>

              {languagesQuery.isPending && (
                <MenuItem disabled>Đang tải ngôn ngữ...</MenuItem>
              )}

              {languagesQuery.isError && (
                <MenuItem disabled>Không thể tải ngôn ngữ</MenuItem>
              )}

              {languages.map((language) => (
                <MenuItem key={language.id} value={language.id}>
                  {language.name}
                </MenuItem>
              ))}
            </FilterSelect>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Trình độ</FilterLabel>
            <FilterSelect
              value={filters.level}
              onChange={(value) => updateFilter("level", value)}
            >
              <MenuItem value="all">Tất cả trình độ</MenuItem>

              {levelsQuery.isPending && (
                <MenuItem disabled>Đang tải trình độ...</MenuItem>
              )}

              {levelsQuery.isError && (
                <MenuItem disabled>Không thể tải trình độ</MenuItem>
              )}

              {levels.map((level) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.name}
                </MenuItem>
              ))}
            </FilterSelect>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Trạng thái</FilterLabel>

            <FilterSelect
              value={filters.status}
              onChange={(value) => updateFilter("status", value)}
            >
              <MenuItem value="all">Tất cả trạng thái</MenuItem>

              <MenuItem value="published">Đã xuất bản</MenuItem>

              <MenuItem value="draft">Bản nháp</MenuItem>
            </FilterSelect>
          </Grid>
          <Grid size={{ xs: 12, lg: 3.2 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: { xs: "flex-start", lg: "flex-end" } }}
            >
              <Button
                variant="outlined"
                onClick={resetFilters}
                sx={{ minHeight: 40, px: 2 }}
              >
                Đặt lại
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setPage(1);
                  setAppliedFilters(filters);
                }}
                sx={{
                  minHeight: 40,
                  px: 2.5,
                }}
              >
                Áp dụng
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {curriculumsQuery.isPending ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <LoadingView variant="skeleton" />
        </Paper>
      ) : curriculumsQuery.isError ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <ErrorView
            description="Không thể tải danh sách lộ trình."
            onRetry={() => void curriculumsQuery.refetch()}
          />
        </Paper>
      ) : curriculums.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <EmptyView
            title="Không tìm thấy lộ trình"
            description="Hãy thử thay đổi bộ lọc tìm kiếm."
          />
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {curriculums.map((curriculum) => (
            <Paper
              key={curriculum.id}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                px: { xs: 2, sm: 2.5 },
                py: 2,
              }}
            >
              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        borderRadius: 1.5,
                        color: "primary.main",
                        bgcolor: "#f0edff",
                      }}
                    >
                      <AutoStoriesOutlinedIcon sx={{ fontSize: 21 }} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={curriculum.level.name}
                          size="small"
                          sx={{
                            height: 22,
                            color: "primary.main",
                            bgcolor: "#ebe7ff",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />

                        <Typography sx={{ fontSize: 14, fontWeight: 750 }}>
                          {curriculum.title}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1.2}
                        sx={{
                          mt: 0.7,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: 11 }}
                        >
                          {curriculum.level.language.name}
                        </Typography>

                        <Typography color="text.disabled">•</Typography>

                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: 11 }}
                        >
                          {curriculum.chapterCount} chương
                        </Typography>

                        <Typography color="text.disabled">•</Typography>

                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: 11 }}
                        >
                          {curriculum.lessonCount} bài học
                        </Typography>

                        <Typography
                          color={
                            curriculum.status === "PUBLISHED"
                              ? "#129958"
                              : "text.secondary"
                          }
                          sx={{ fontSize: 11, fontWeight: 700 }}
                        >
                          •{" "}
                          {curriculum.status === "PUBLISHED"
                            ? "Đã xuất bản"
                            : "Bản nháp"}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 7, md: 3.2 }}>
                  <Stack
                    direction="row"
                    sx={{
                      mb: 0.8,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontSize: 10 }}>
                      Hoàn thiện
                    </Typography>

                    <Typography
                      color="primary.main"
                      sx={{ fontSize: 10, fontWeight: 800 }}
                    >
                      {curriculum.completionPercentage}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={curriculum.completionPercentage}
                    sx={{
                      height: 5,
                      borderRadius: 5,
                      bgcolor: "#eceaf2",
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 5, md: 2.8 }}>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      alignItems: "center",
                      justifyContent: {
                        xs: "flex-start",
                        sm: "flex-end",
                      },
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontSize: 10 }}>
                      Cập nhật: {formatDate(curriculum.updatedAt)}
                    </Typography>

                    <IconButton aria-label="Tùy chọn" size="small">
                      <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    <IconButton aria-label="Mở chi tiết" size="small">
                      <ExpandMoreIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          ))}

          {pagination && (
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <AppPagination
                total={pagination.total}
                page={pagination.page}
                pageSize={pagination.limit}
                currentCount={curriculums.length}
                itemLabel="lộ trình"
                onPageChange={setPage}
              />
            </Paper>
          )}
        </Stack>
      )}
    </Stack>
  );
}

function FilterLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ mb: 0.7, fontSize: 12, fontWeight: 650 }}>
      {children}
    </Typography>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <FormControl fullWidth size="small">
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{ fontSize: 12 }}
      >
        {children}
      </Select>
    </FormControl>
  );
}
