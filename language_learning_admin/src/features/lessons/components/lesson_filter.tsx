import { Button, FormControl, Grid, MenuItem, Select, Stack } from '@mui/material'

import { SearchInput } from '@/components/forms/search_input'
import type { LessonFilters } from '@/features/lessons/types/lesson.types'

type LessonFilterProps = {
  filters: LessonFilters
  onChange: (field: keyof LessonFilters, value: string) => void
  onReset: () => void
}

export function LessonFilter({ filters, onChange, onReset }: LessonFilterProps) {
  return (
    <Grid container spacing={1} sx={{ alignItems: 'center' }}>
      <Grid size={{ xs: 12, md: 4, xl: 3.5 }}>
        <SearchInput
          fullWidth
          value={filters.search}
          onSearchChange={(value) => onChange('search', value)}
          placeholder="Tìm kiếm bài học..."
          size="small"
        />
      </Grid>
      <FilterSelect value={filters.language} onChange={(value) => onChange('language', value)} label="Ngôn ngữ">
        <MenuItem value="all">Tất cả ngôn ngữ</MenuItem>
        <MenuItem value="korean">Tiếng Hàn</MenuItem>
      </FilterSelect>
      <FilterSelect value={filters.level} onChange={(value) => onChange('level', value)} label="Trình độ">
        <MenuItem value="all">Tất cả trình độ</MenuItem>
        <MenuItem value="beginner">Sơ cấp 1</MenuItem>
      </FilterSelect>
      <FilterSelect value={filters.curriculum} onChange={(value) => onChange('curriculum', value)} label="Lộ trình">
        <MenuItem value="all">Tất cả lộ trình</MenuItem>
        <MenuItem value="basic-korean">Tiếng Hàn cơ bản</MenuItem>
      </FilterSelect>
      <FilterSelect value={filters.chapter} onChange={(value) => onChange('chapter', value)} label="Chương">
        <MenuItem value="all">Tất cả chương</MenuItem>
        <MenuItem value="chapter-1">Chương 1</MenuItem>
        <MenuItem value="chapter-2">Chương 2</MenuItem>
      </FilterSelect>
      <FilterSelect value={filters.status} onChange={(value) => onChange('status', value)} label="Trạng thái">
        <MenuItem value="all">Tất cả trạng thái</MenuItem>
        <MenuItem value="published">Đã xuất bản</MenuItem>
        <MenuItem value="editing">Đang chỉnh sửa</MenuItem>
        <MenuItem value="draft">Bản nháp</MenuItem>
        <MenuItem value="incomplete">Chưa hoàn thành</MenuItem>
      </FilterSelect>
      <Grid size={{ xs: 12, xl: 'auto' }}>
        <Stack direction="row" sx={{ justifyContent: { xs: 'flex-start', xl: 'flex-end' } }}>
          <Button onClick={onReset} sx={{ whiteSpace: 'nowrap' }}>Đặt lại bộ lọc</Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

function FilterSelect({ value, onChange, label, children }: { value: string; onChange: (value: string) => void; label: string; children: React.ReactNode }) {
  return (
    <Grid size={{ xs: 6, sm: 4, md: 2, xl: 1.4 }}>
      <FormControl fullWidth size="small">
        <Select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          displayEmpty
          renderValue={(selected) => selected === 'all' ? label : getSelectedLabel(selected)}
          sx={{ fontSize: 12 }}
        >
          {children}
        </Select>
      </FormControl>
    </Grid>
  )
}

function getSelectedLabel(value: string) {
  const labels: Record<string, string> = {
    korean: 'Tiếng Hàn',
    beginner: 'Sơ cấp 1',
    'basic-korean': 'Hàn cơ bản',
    'chapter-1': 'Chương 1',
    'chapter-2': 'Chương 2',
    published: 'Đã xuất bản',
    editing: 'Đang chỉnh sửa',
    draft: 'Bản nháp',
    incomplete: 'Chưa hoàn thành',
  }
  return labels[value] ?? value
}
