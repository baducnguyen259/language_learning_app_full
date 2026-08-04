import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { EmptyView } from '@/components/feedback/empty_view'
import { LessonFilter } from '@/features/lessons/components/lesson_filter'
import { LessonTable } from '@/features/lessons/components/lesson_table'
import type { Lesson, LessonFilters } from '@/features/lessons/types/lesson.types'

const initialFilters: LessonFilters = {
  search: '',
  language: 'all',
  level: 'all',
  curriculum: 'all',
  chapter: 'all',
  status: 'all',
}

const lessons: Lesson[] = [
  { id: '5', title: 'Bài 5: Xin chào', language: 'Tiếng Hàn', curriculum: 'Hàn cơ bản', chapter: 'Chương 1', level: 'Sơ cấp 1', duration: 15, completion: 100, status: 'published', updatedAt: '12/10/2025', thumbnail: '👋' },
  { id: '6', title: 'Bài 6: Tạm biệt', language: 'Tiếng Hàn', curriculum: 'Hàn cơ bản', chapter: 'Chương 1', level: 'Sơ cấp 1', duration: 12, completion: 80, status: 'editing', updatedAt: '14/10/2025', thumbnail: '🗼' },
  { id: '7', title: 'Bài 7: Xin lỗi và Cảm ơn', language: 'Tiếng Hàn', curriculum: 'Hàn cơ bản', chapter: 'Chương 2', level: 'Sơ cấp 1', duration: 20, completion: 45, status: 'draft', updatedAt: '15/10/2025', thumbnail: '🎎' },
  { id: '8', title: 'Bài 8: Giới thiệu bản thân', language: 'Tiếng Hàn', curriculum: 'Hàn cơ bản', chapter: 'Chương 2', level: 'Sơ cấp 1', duration: 25, completion: 0, status: 'incomplete', updatedAt: '16/10/2025', thumbnail: '🪪' },
]

export function LessonListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(initialFilters)

  const filteredLessons = useMemo(() => lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLocaleLowerCase('vi').includes(filters.search.toLocaleLowerCase('vi'))
    const matchesLanguage = filters.language === 'all' || filters.language === 'korean'
    const matchesLevel = filters.level === 'all' || filters.level === 'beginner'
    const matchesCurriculum = filters.curriculum === 'all' || filters.curriculum === 'basic-korean'
    const matchesChapter = filters.chapter === 'all' || lesson.chapter === (filters.chapter === 'chapter-1' ? 'Chương 1' : 'Chương 2')
    const matchesStatus = filters.status === 'all' || lesson.status === filters.status
    return matchesSearch && matchesLanguage && matchesLevel && matchesCurriculum && matchesChapter && matchesStatus
  }), [filters])

  function updateFilter(field: keyof LessonFilters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography component="h1" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, lineHeight: 1.25, fontWeight: 750 }}>
            Quản lý bài học
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>Tạo và quản lý nội dung các bài học</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/lessons/new')} sx={{ minHeight: 42, px: 2.5, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
          Thêm bài học
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <LessonFilter filters={filters} onChange={updateFilter} onReset={() => setFilters(initialFilters)} />
        </Box>
        {filteredLessons.length ? (
          <LessonTable lessons={filteredLessons} />
        ) : (
          <Box sx={{ borderTop: '1px solid #efedf4' }}><EmptyView title="Không tìm thấy bài học" description="Hãy thử thay đổi bộ lọc tìm kiếm." /></Box>
        )}
      </Paper>
    </Stack>
  )
}
