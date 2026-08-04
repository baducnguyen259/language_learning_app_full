import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'

import { LessonForm } from '@/features/lessons/components/lesson_form'

export function LessonCreatePage() {
  const navigate = useNavigate()

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography component="h1" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, lineHeight: 1.25, fontWeight: 750 }}>
              Thêm bài học mới
            </Typography>
            <Chip label="Chưa lưu" size="small" sx={{ height: 22, color: 'text.secondary', bgcolor: '#eeedf2', fontSize: 9 }} />
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>Tạo nội dung bài học tương tác cho lộ trình học.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined">Xem trước</Button>
          <Button variant="contained">Lưu bản nháp</Button>
        </Stack>
      </Stack>
      <LessonForm onCancel={() => navigate('/lessons')} />
    </Stack>
  )
}
