import {
  Box,
  Checkbox,
  Chip,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { AppPagination } from '@/components/tables/app_pagination'
import { StatusChip } from '@/components/tables/status_chip'
import type { Lesson } from '@/features/lessons/types/lesson.types'

const statusConfig = {
  published: { label: 'Đã xuất bản', color: '#14945a', background: '#dcf7e9' },
  editing: { label: 'Đang chỉnh sửa', color: '#5b43d6', background: '#ebe7ff' },
  draft: { label: 'Bản nháp', color: '#6d6878', background: '#eeedf1' },
  incomplete: { label: 'Chưa hoàn thành', color: '#a45838', background: '#fbebe3' },
}

type LessonTableProps = {
  lessons: Lesson[]
}

export function LessonTable({ lessons }: LessonTableProps) {
  return (
    <>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1050 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#faf9fd' }}>
              <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
              <HeaderCell>Ảnh</HeaderCell>
              <HeaderCell>Tên bài học</HeaderCell>
              <HeaderCell>Lộ trình</HeaderCell>
              <HeaderCell>Chương</HeaderCell>
              <HeaderCell>Trình độ</HeaderCell>
              <HeaderCell>Thời lượng</HeaderCell>
              <HeaderCell>Hoàn thiện</HeaderCell>
              <HeaderCell>Trạng thái</HeaderCell>
              <HeaderCell>Cập nhật</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.map((lesson) => {
              const status = statusConfig[lesson.status]
              return (
                <TableRow key={lesson.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 1.5, bgcolor: '#f2f0f7', fontSize: 22 }}>
                      {lesson.thumbnail}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: 175 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 750 }}>{lesson.title}</Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 100 }}>
                    <Typography sx={{ fontSize: 11 }}>{lesson.language}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 10 }}>{lesson.curriculum}</Typography>
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: 11 }}>{lesson.chapter}</Typography></TableCell>
                  <TableCell>
                    <Chip label={lesson.level} size="small" sx={{ height: 29, maxWidth: 54, color: 'primary.main', bgcolor: '#f0edff', fontSize: 10, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell><Typography sx={{ fontSize: 11 }}>{lesson.duration} phút</Typography></TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={lesson.completion}
                        sx={{ width: 75, height: 5, borderRadius: 5, bgcolor: '#eceaf2', '& .MuiLinearProgress-bar': { bgcolor: lesson.completion === 100 ? '#1fad6b' : 'primary.main' } }}
                      />
                      <Typography sx={{ fontSize: 9, fontWeight: 700 }}>{lesson.completion}%</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><StatusChip label={status.label} tone={lesson.status === 'published' ? 'success' : lesson.status === 'editing' ? 'primary' : lesson.status === 'incomplete' ? 'warning' : 'neutral'} sx={{ height: 'auto', maxWidth: 72, py: 0.4, '& .MuiChip-label': { px: 1, whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.15 } }} /></TableCell>
                  <TableCell><Typography sx={{ fontSize: 10 }}>{lesson.updatedAt}</Typography></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <AppPagination total={128} currentCount={lessons.length} itemLabel="bài học" />
    </>
  )
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <TableCell sx={{ py: 1.2 }}>
      <Typography sx={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.35 }}>{children}</Typography>
    </TableCell>
  )
}
