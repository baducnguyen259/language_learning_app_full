import { FormControl, Grid, MenuItem, Select } from '@mui/material'

import { SearchInput } from '@/components/forms/search_input'
import type { VocabularyFilters } from '@/features/vocabularies/types/vocabulary.types'

type VocabularyFilterProps = {
  filters: VocabularyFilters
  onChange: (field: keyof VocabularyFilters, value: string) => void
}

export function VocabularyFilter({ filters, onChange }: VocabularyFilterProps) {
  return (
    <Grid container spacing={1.2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <SearchInput
          fullWidth
          size="small"
          value={filters.search}
          onSearchChange={(value) => onChange('search', value)}
          placeholder="Tìm từ tiếng Hàn hoặc nghĩa tiếng Việt"
        />
      </Grid>
      <VocabularySelect label="Trình độ" value={filters.level} onChange={(value) => onChange('level', value)}>
        <MenuItem value="all">Tất cả trình độ</MenuItem>
        <MenuItem value="beginner">Sơ cấp 1</MenuItem>
      </VocabularySelect>
      <VocabularySelect label="Chủ đề" value={filters.topic} onChange={(value) => onChange('topic', value)}>
        <MenuItem value="all">Tất cả chủ đề</MenuItem>
        <MenuItem value="greeting">Chào hỏi</MenuItem>
      </VocabularySelect>
      <VocabularySelect label="Bài học" value={filters.lesson} onChange={(value) => onChange('lesson', value)}>
        <MenuItem value="all">Tất cả bài học</MenuItem>
        <MenuItem value="lesson-1">Bài 1</MenuItem>
      </VocabularySelect>
      <VocabularySelect label="Loại từ" value={filters.wordType} onChange={(value) => onChange('wordType', value)}>
        <MenuItem value="all">Tất cả loại từ</MenuItem>
        <MenuItem value="noun">Danh từ</MenuItem>
        <MenuItem value="verb">Động từ</MenuItem>
      </VocabularySelect>
    </Grid>
  )
}

function VocabularySelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <Grid size={{ xs: 6, sm: 3, md: 2 }}>
      <FormControl fullWidth size="small">
        <Select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          displayEmpty
          renderValue={(selected) => selected === 'all' ? label : selectedLabel[selected] ?? selected}
          sx={{ fontSize: 12 }}
        >
          {children}
        </Select>
      </FormControl>
    </Grid>
  )
}

const selectedLabel: Record<string, string> = {
  beginner: 'Sơ cấp 1',
  greeting: 'Chào hỏi',
  'lesson-1': 'Bài 1',
  noun: 'Danh từ',
  verb: 'Động từ',
}
