import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import SpellcheckOutlinedIcon from '@mui/icons-material/SpellcheckOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Button, Chip, Divider, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

const overviewItems = [
  {
    label: 'Người dùng',
    value: '1.248',
    caption: 'So với tháng trước',
    change: '+12%',
    icon: <GroupsOutlinedIcon />,
    color: '#6c4ce4',
    background: '#eee9ff',
  },
  {
    label: 'Người đang học',
    value: '386',
    caption: 'Hoạt động hôm nay',
    change: '+8%',
    icon: <LanguageOutlinedIcon />,
    color: '#16b86a',
    background: '#ddf8e9',
  },
  {
    label: 'Bài học',
    value: '128',
    caption: '102 bài đã xuất bản',
    icon: <AutoStoriesOutlinedIcon />,
    color: '#7067df',
    background: '#eceaff',
  },
  {
    label: 'Tỷ lệ hoàn thành',
    value: '72%',
    caption: '',
    change: '+5%',
    icon: <CheckCircleOutlineIcon />,
    color: '#22bd71',
    background: '#ddf8e9',
    progress: 72,
  },
]

const chartData = [
  { day: 'T2', users: 42, completed: 32 },
  { day: 'T3', users: 27, completed: 28 },
  { day: 'T4', users: 56, completed: 53 },
  { day: 'T5', users: 38, completed: 31 },
  { day: 'T6', users: 65, completed: 63 },
  { day: 'T7', users: 47, completed: 44 },
  { day: 'CN', users: 73, completed: 71 },
]

const popularLessons = [
  { rank: '#1', name: 'Chào hỏi cơ bản', level: 'Nhập môn', learners: '1.204', completion: '92%', status: 'Đang hoạt động' },
  { rank: '#2', name: 'Giới thiệu bản thân', level: 'Nhập môn', learners: '986', completion: '88%', status: 'Đang hoạt động' },
  { rank: '#3', name: 'Giao tiếp hằng ngày', level: 'Sơ cấp', learners: '742', completion: '81%', status: 'Đang hoạt động' },
]

function SectionCard({ children, sx = {} }: { children: ReactNode; sx?: Record<string, unknown> }) {
  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2, sm: 2.5 }, ...sx }}
    >
      {children}
    </Paper>
  )
}

export function DashboardPage() {
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography component="h1" variant="h4" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, fontWeight: 750 }}>
          Tổng quan
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
          Theo dõi hoạt động của ứng dụng học tập LingoGo
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {overviewItems.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, xl: 3 }}>
            <SectionCard sx={{ height: '100%', minHeight: 152 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: '50%', color: item.color, bgcolor: item.background }}>
                  {item.icon}
                </Box>
                {item.change && (
                  <Chip
                    icon={<TrendingUpIcon sx={{ fontSize: '13px !important' }} />}
                    label={item.change}
                    size="small"
                    sx={{ height: 23, color: '#0c9a55', bgcolor: '#dff9eb', fontSize: 11, fontWeight: 700 }}
                  />
                )}
              </Stack>
              <Typography sx={{ mt: 1.7, color: 'text.secondary', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: 25, lineHeight: 1.15, fontWeight: 750, color: '#20202a' }}>{item.value}</Typography>
              {item.progress ? (
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{ mt: 1.5, height: 5, borderRadius: 4, bgcolor: '#eceaf2', '& .MuiLinearProgress-bar': { bgcolor: item.color } }}
                />
              ) : (
                <Typography color="text.secondary" sx={{ mt: 0.7, fontSize: 11 }}>{item.caption}</Typography>
              )}
            </SectionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SectionCard sx={{ height: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 750 }}>Hoạt động học tập (7 ngày)</Typography>
              <Stack direction="row" spacing={2.5}>
                <ChartLegend color="#5b43d6" label="Người học" />
                <ChartLegend color="#087943" label="Hoàn thành" />
              </Stack>
            </Stack>
            <Box sx={{ height: 238, mt: 2.5, display: 'flex', alignItems: 'flex-end', gap: { xs: 1.2, sm: 2.5 }, px: { xs: 0, sm: 1 } }}>
              {chartData.map((item) => (
                <Stack key={item.day} sx={{ alignItems: 'center', justifyContent: 'flex-end', flex: 1, height: '100%', minWidth: 0 }}>
                  <Stack direction="row" sx={{ alignItems: 'flex-end', justifyContent: 'center', flex: 1, width: '100%' }}>
                    <Box sx={{ width: { xs: '42%', sm: 20 }, height: `${item.users * 2.5}px`, maxHeight: '100%', bgcolor: '#5b43d6', borderRadius: '2px 2px 0 0' }} />
                    <Box sx={{ width: { xs: '42%', sm: 20 }, height: `${item.completed * 2.5}px`, maxHeight: '100%', bgcolor: '#087943', borderRadius: '2px 2px 0 0' }} />
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 1.2, fontSize: 11 }}>{item.day}</Typography>
                </Stack>
              ))}
            </Box>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard sx={{ height: '100%' }}>
            <Typography sx={{ fontWeight: 750 }}>Tình trạng nội dung</Typography>
            <Stack spacing={2.2} sx={{ mt: 2.5 }}>
              <StatusProgress label="Đã xuất bản" value={80} color="#5b43d6" />
              <StatusProgress label="Bản nháp" value={14} color="#eaa928" />
              <StatusProgress label="Chưa hoàn thành" value={6} color="#ed4f5e" />
            </Stack>
            <Divider sx={{ my: 2.5 }} />
            <Typography sx={{ fontWeight: 750, mb: 1.5 }}>Thao tác nhanh</Typography>
            <Grid container spacing={1}>
              <QuickAction icon={<AutoStoriesOutlinedIcon />} label="Thêm bài học" />
              <QuickAction icon={<SpellcheckOutlinedIcon />} label="Từ vựng" />
              <QuickAction icon={<QuizOutlinedIcon />} label="Tạo Quiz" />
              <QuickAction icon={<NotificationsNoneOutlinedIcon />} label="Thông báo" />
            </Grid>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard sx={{ p: 0, overflow: 'hidden' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, sm: 2.5 }, py: 2 }}>
          <Typography sx={{ fontWeight: 750 }}>Bài học phổ biến</Typography>
          <Button size="small" sx={{ fontSize: 12 }}>Xem tất cả</Button>
        </Stack>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 760 }}>
            <Grid container sx={{ px: 2.5, py: 1.1, bgcolor: '#faf9fd', color: 'text.secondary' }}>
              <Grid size={1}><TableLabel>Hạng</TableLabel></Grid>
              <Grid size={4}><TableLabel>Tên bài học</TableLabel></Grid>
              <Grid size={2}><TableLabel>Trình độ</TableLabel></Grid>
              <Grid size={2}><TableLabel>Lượt học</TableLabel></Grid>
              <Grid size={1.5}><TableLabel>Hoàn thành</TableLabel></Grid>
              <Grid size={1.5}><TableLabel>Trạng thái</TableLabel></Grid>
            </Grid>
            {popularLessons.map((lesson, index) => (
              <Grid key={lesson.name} container sx={{ alignItems: 'center', px: 2.5, py: 1.4, borderTop: index ? '1px solid #efedf4' : 'none' }}>
                <Grid size={1}><Typography color="primary.main" sx={{ fontSize: 13, fontWeight: 800 }}>{lesson.rank}</Typography></Grid>
                <Grid size={4}><Typography sx={{ fontSize: 13, fontWeight: 650 }}>{lesson.name}</Typography></Grid>
                <Grid size={2}><Chip label={lesson.level} size="small" sx={{ height: 22, fontSize: 10, bgcolor: '#f1eefc' }} /></Grid>
                <Grid size={2}><Typography sx={{ fontSize: 13 }}>{lesson.learners}</Typography></Grid>
                <Grid size={1.5}><Typography sx={{ fontSize: 13 }}>{lesson.completion}</Typography></Grid>
                <Grid size={1.5}><CheckCircleOutlineIcon sx={{ color: '#15a862', fontSize: 18 }} /></Grid>
              </Grid>
            ))}
          </Box>
        </Box>
      </SectionCard>
    </Stack>
  )
}

function ChartLegend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.7} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
      <Typography color="text.secondary" sx={{ fontSize: 11 }}>{label}</Typography>
    </Stack>
  )
}

function StatusProgress({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.7 }}>
        <Typography sx={{ fontSize: 12 }}>{label}</Typography>
        <Typography sx={{ color, fontSize: 12, fontWeight: 800 }}>{value}%</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={value} sx={{ height: 5, borderRadius: 5, bgcolor: '#eeecf3', '& .MuiLinearProgress-bar': { bgcolor: color } }} />
    </Box>
  )
}

function QuickAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Grid size={6}>
      <Button
        fullWidth
        startIcon={icon}
        sx={{ minHeight: 48, px: 1, bgcolor: '#f5f2ff', color: '#5b43d6', fontSize: 11, '& .MuiButton-startIcon svg': { fontSize: 17 } }}
      >
        {label}
      </Button>
    </Grid>
  )
}

function TableLabel({ children }: { children: ReactNode }) {
  return <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.35 }}>{children}</Typography>
}
