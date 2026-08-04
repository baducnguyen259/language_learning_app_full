import AddIcon from '@mui/icons-material/Add'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
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
} from '@mui/material'
import { useState } from 'react'

import { SearchInput } from '@/components/forms/search_input'
import { EmptyView } from '@/components/feedback/empty_view'

type CurriculumFilters = {
  keyword: string
  language: string
  level: string
  status: string
}

const initialFilters: CurriculumFilters = {
  keyword: '',
  language: 'all',
  level: 'all',
  status: 'all',
}

export function CurriculumListPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)

  const showCurriculum =
    (!appliedFilters.keyword || 'tiếng hàn cơ bản'.includes(appliedFilters.keyword.toLocaleLowerCase('vi'))) &&
    ['all', 'korean'].includes(appliedFilters.language) &&
    ['all', 'beginner'].includes(appliedFilters.level) &&
    ['all', 'published'].includes(appliedFilters.status)

  function updateFilter(field: keyof CurriculumFilters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function resetFilters() {
    setFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Box>
          <Typography component="h1" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, lineHeight: 1.25, fontWeight: 750 }}>
            Quản lý lộ trình
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
            Quản lý cấp độ, chương và bài học
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ minHeight: 42, px: 2.5, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
          Thêm lộ trình
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2, sm: 2.5 } }}>
        <Grid container spacing={1.5} sx={{ alignItems: 'flex-end' }}>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Tìm kiếm</FilterLabel>
            <SearchInput
              fullWidth
              value={filters.keyword}
              onSearchChange={(value) => updateFilter('keyword', value)}
              placeholder="Tìm kiếm..."
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Ngôn ngữ</FilterLabel>
            <FilterSelect value={filters.language} onChange={(value) => updateFilter('language', value)}>
              <MenuItem value="all">Tất cả ngôn ngữ</MenuItem>
              <MenuItem value="korean">Tiếng Hàn</MenuItem>
              <MenuItem value="english">Tiếng Anh</MenuItem>
              <MenuItem value="japanese">Tiếng Nhật</MenuItem>
            </FilterSelect>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Trình độ</FilterLabel>
            <FilterSelect value={filters.level} onChange={(value) => updateFilter('level', value)}>
              <MenuItem value="all">Tất cả trình độ</MenuItem>
              <MenuItem value="beginner">Sơ cấp</MenuItem>
              <MenuItem value="intermediate">Trung cấp</MenuItem>
              <MenuItem value="advanced">Cao cấp</MenuItem>
            </FilterSelect>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.2 }}>
            <FilterLabel>Trạng thái</FilterLabel>
            <FilterSelect value={filters.status} onChange={(value) => updateFilter('status', value)}>
              <MenuItem value="all">Tất cả trạng thái</MenuItem>
              <MenuItem value="published">Đã xuất bản</MenuItem>
              <MenuItem value="draft">Bản nháp</MenuItem>
            </FilterSelect>
          </Grid>
          <Grid size={{ xs: 12, lg: 3.2 }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', lg: 'flex-end' } }}>
              <Button variant="outlined" onClick={resetFilters} sx={{ minHeight: 40, px: 2 }}>Đặt lại</Button>
              <Button variant="contained" onClick={() => setAppliedFilters(filters)} sx={{ minHeight: 40, px: 2.5 }}>Áp dụng</Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {showCurriculum ? (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: { xs: 2, sm: 2.5 }, py: 2 }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box sx={{ display: 'grid', placeItems: 'center', width: 42, height: 42, flexShrink: 0, borderRadius: 1.5, color: 'primary.main', bgcolor: '#f0edff' }}>
                  <AutoStoriesOutlinedIcon sx={{ fontSize: 21 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip label="Sơ cấp 1" size="small" sx={{ height: 22, color: 'primary.main', bgcolor: '#ebe7ff', fontSize: 10, fontWeight: 700 }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 750 }}>Tiếng Hàn cơ bản</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.2} sx={{ mt: 0.7, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography color="text.secondary" sx={{ fontSize: 11 }}>Tiếng Hàn</Typography>
                    <Typography color="text.disabled" sx={{ fontSize: 10 }}>•</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 11 }}>3 chương</Typography>
                    <Typography color="text.disabled" sx={{ fontSize: 10 }}>•</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 11 }}>12 bài học</Typography>
                    <Typography color="#129958" sx={{ fontSize: 11, fontWeight: 700 }}>• Đã xuất bản</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 7, md: 3.2 }}>
              <Stack direction="row" sx={{ mb: 0.8, justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ fontSize: 10 }}>Hoàn thiện</Typography>
                <Typography color="primary.main" sx={{ fontSize: 10, fontWeight: 800 }}>85%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={85} sx={{ height: 5, borderRadius: 5, bgcolor: '#eceaf2', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 5, md: 2.8 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Typography color="text.secondary" sx={{ mr: 0.5, fontSize: 10 }}>Cập nhật: 12/10/2025</Typography>
                <IconButton aria-label="Tùy chọn" size="small"><MoreVertIcon sx={{ fontSize: 18 }} /></IconButton>
                <IconButton aria-label="Mở chi tiết" size="small"><ExpandMoreIcon sx={{ fontSize: 18 }} /></IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}><EmptyView title="Không tìm thấy lộ trình" description="Hãy thử thay đổi bộ lọc tìm kiếm." /></Paper>
      )}
    </Stack>
  )
}

function FilterLabel({ children }: { children: string }) {
  return <Typography sx={{ mb: 0.7, fontSize: 12, fontWeight: 650 }}>{children}</Typography>
}

function FilterSelect({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <FormControl fullWidth size="small">
      <Select value={value} onChange={(event) => onChange(event.target.value)} sx={{ fontSize: 12 }}>
        {children}
      </Select>
    </FormControl>
  )
}
