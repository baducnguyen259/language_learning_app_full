import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { Button, FormControl, Grid, MenuItem, Select } from '@mui/material'

import { SearchInput } from '@/components/forms/search_input'
import type { UserFilters } from '@/features/users/types/user.types'

type UserFilterProps = {
  filters: UserFilters
  onChange: (field: keyof UserFilters, value: string) => void
}

export function UserFilter({ filters, onChange }: UserFilterProps) {
  return (
    <Grid container spacing={1.2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <SearchInput
          fullWidth
          size="small"
          value={filters.search}
          onSearchChange={(value) => onChange('search', value)}
          placeholder="Tìm kiếm theo tên hoặc email"
        />
      </Grid>
      <FilterSelect label="Trình độ" value={filters.level} onChange={(value) => onChange('level', value)}>
        <MenuItem value="all">Tất cả trình độ</MenuItem>
        <MenuItem value="beginner">Sơ cấp 1</MenuItem>
      </FilterSelect>
      <FilterSelect label="Ngôn ngữ đang học" value={filters.language} onChange={(value) => onChange('language', value)}>
        <MenuItem value="all">Tất cả ngôn ngữ</MenuItem>
        <MenuItem value="korean">Tiếng Hàn</MenuItem>
      </FilterSelect>
      <FilterSelect label="Trạng thái" value={filters.status} onChange={(value) => onChange('status', value)}>
        <MenuItem value="all">Tất cả trạng thái</MenuItem>
        <MenuItem value="active">Đang hoạt động</MenuItem>
        <MenuItem value="locked">Đã khóa</MenuItem>
      </FilterSelect>
      <Grid size={{ xs: 12, sm: 4, md: 2.3 }}>
        <Button fullWidth variant="outlined" startIcon={<CalendarMonthOutlinedIcon />} sx={{ minHeight: 40, color: 'text.primary', borderColor: 'divider', whiteSpace: 'nowrap' }}>
          Ngày tham gia
        </Button>
      </Grid>
    </Grid>
  )
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <Grid size={{ xs: 6, sm: 4, md: 2.3 }}>
      <FormControl fullWidth size="small">
        <Select value={value} onChange={(event) => onChange(event.target.value)} displayEmpty renderValue={(selected) => selected === 'all' ? label : selectedLabels[selected] ?? selected} sx={{ fontSize: 12 }}>
          {children}
        </Select>
      </FormControl>
    </Grid>
  )
}

const selectedLabels: Record<string, string> = {
  beginner: 'Sơ cấp 1',
  korean: 'Tiếng Hàn',
  active: 'Đang hoạt động',
  locked: 'Đã khóa',
}
