import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'

const statistics = [
  { label: 'Người học hoạt động', value: '386', change: '+12%', icon: <GroupsOutlinedIcon />, color: '#6b4ce6', background: '#eee9ff' },
  { label: 'Bài học hoàn thành', value: '2.485', change: '+8%', icon: <AutoStoriesOutlinedIcon />, color: '#18a866', background: '#ddf8e9' },
  { label: 'Điểm Quiz trung bình', value: '82%', icon: <CheckCircleOutlineOutlinedIcon />, color: '#d49a15', background: '#fff3cf' },
  { label: 'Thời gian học TB', value: '24 phút', icon: <AccessTimeOutlinedIcon />, color: '#716d80', background: '#efedf3' },
  { label: 'Tỷ lệ quay lại', value: '68%', icon: <TrendingUpIcon />, color: '#7257db', background: '#eee9ff' },
]

const completionData = [
  { label: 'Sơ cấp 1 cơ bản', value: 82 },
  { label: 'Lộ trình giao tiếp', value: 71 },
  { label: 'Luyện thi TOPIK I', value: 56 },
  { label: 'Tiếng Hàn công sở', value: 86 },
]

const quizDistribution = [6, 18, 92, 61]

export function LearningReportPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('month')

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography component="h1" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, lineHeight: 1.25, fontWeight: 750 }}>Báo cáo học tập</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>Phân tích hoạt động và kết quả của người học</Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
          <Button variant="outlined" startIcon={<CalendarMonthOutlinedIcon />} sx={{ minHeight: 40, color: 'text.primary', borderColor: 'divider' }}>01/10/2025 - 31/10/2025</Button>
          <Button variant="contained" startIcon={<DownloadOutlinedIcon />} endIcon={<KeyboardArrowDownIcon />} sx={{ minHeight: 40 }}>Xuất báo cáo</Button>
        </Stack>
      </Stack>

      <Grid container spacing={1.5}>
        {statistics.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <Paper elevation={0} sx={{ height: '100%', minHeight: 118, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Typography color="text.secondary" sx={{ maxWidth: 105, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography>
                <Box sx={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 1.4, color: item.color, bgcolor: item.background, '& svg': { fontSize: 17 } }}>{item.icon}</Box>
              </Stack>
              <Stack direction="row" spacing={0.8} sx={{ mt: 1.2, alignItems: 'flex-end' }}>
                <Typography sx={{ fontSize: 22, lineHeight: 1, fontWeight: 800 }}>{item.value}</Typography>
                {item.change && <Chip icon={<TrendingUpIcon />} label={item.change} size="small" sx={{ height: 20, color: '#108a50', bgcolor: '#dcf8e9', fontSize: 9, fontWeight: 700, '& .MuiChip-icon': { color: 'inherit', fontSize: 12 } }} />}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ReportCard>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 750 }}>Xu hướng học tập</Typography>
              <Box sx={{ display: 'flex', p: 0.4, borderRadius: 1.4, bgcolor: '#f1eff5' }}>
                <PeriodButton active={period === 'week'} onClick={() => setPeriod('week')}>7 ngày</PeriodButton>
                <PeriodButton active={period === 'month'} onClick={() => setPeriod('month')}>30 ngày</PeriodButton>
              </Box>
            </Stack>
            <TrendChart period={period} />
          </ReportCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ReportCard>
            <Typography sx={{ fontSize: 15, fontWeight: 750 }}>Người học theo trình độ</Typography>
            <Stack sx={{ mt: 2.5, alignItems: 'center' }}>
              <Box
                role="img"
                aria-label="Sơ cấp 1 45%, Sơ cấp 2 35%, Trung cấp 20%"
                sx={{ position: 'relative', width: 170, height: 170, borderRadius: '50%', background: 'conic-gradient(#6750dd 0 45%, #087943 45% 80%, #f0ad17 80% 100%)' }}
              >
                <Box sx={{ position: 'absolute', inset: 32, borderRadius: '50%', bgcolor: '#fff' }} />
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Legend color="#6750dd" label="Sơ cấp 1" />
                <Legend color="#087943" label="Sơ cấp 2" />
                <Legend color="#f0ad17" label="Trung cấp" />
              </Stack>
            </Stack>
          </ReportCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <ReportCard>
            <Typography sx={{ fontSize: 15, fontWeight: 750 }}>Tỷ lệ hoàn thành theo lộ trình</Typography>
            <Stack spacing={2.1} sx={{ mt: 2.5 }}>
              {completionData.map((item) => (
                <Stack key={item.label} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Typography color="text.secondary" sx={{ width: { xs: 105, sm: 145 }, flexShrink: 0, fontSize: 11 }}>{item.label}</Typography>
                  <Box sx={{ flexGrow: 1, height: 23, borderRadius: '0 3px 3px 0', bgcolor: '#f1eff6' }}>
                    <Box sx={{ width: `${item.value}%`, height: '100%', borderRadius: '0 3px 3px 0', bgcolor: '#6952d9' }} />
                  </Box>
                  <Typography sx={{ width: 30, fontSize: 10, fontWeight: 750 }}>{item.value}%</Typography>
                </Stack>
              ))}
            </Stack>
          </ReportCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ReportCard>
            <Typography sx={{ fontSize: 15, fontWeight: 750 }}>Phân phối điểm Quiz</Typography>
            <Stack direction="row" spacing={2} sx={{ height: 220, mt: 2, px: 1, alignItems: 'flex-end', borderBottom: '1px solid #dedbe5' }}>
              {quizDistribution.map((value, index) => (
                <Stack key={value} sx={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Box sx={{ width: '62%', height: `${value}%`, minHeight: 5, borderRadius: '3px 3px 0 0', bgcolor: '#68e69a' }} />
                  <Typography color="text.secondary" sx={{ mt: 1, mb: -2.3, fontSize: 9 }}>{['0-49', '50-69', '70-89', '90-100'][index]}</Typography>
                </Stack>
              ))}
            </Stack>
          </ReportCard>
        </Grid>
      </Grid>
    </Stack>
  )
}

function ReportCard({ children }: { children: React.ReactNode }) {
  return <Paper elevation={0} sx={{ height: '100%', minHeight: 310, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2, sm: 2.5 } }}>{children}</Paper>
}

function PeriodButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <Button size="small" onClick={onClick} sx={{ minWidth: 54, minHeight: 27, py: 0, px: 1, color: active ? '#fff' : 'text.secondary', bgcolor: active ? 'primary.main' : 'transparent', fontSize: 9, '&:hover': { bgcolor: active ? 'primary.dark' : '#e8e5ee' } }}>{children}</Button>
}

function TrendChart({ period }: { period: 'week' | 'month' }) {
  const learningPoints = period === 'month' ? '5,105 48,91 88,110 126,74 164,60 202,51 242,68 280,48 320,29' : '5,110 58,82 112,92 166,55 220,64 274,37 320,49'
  const completionPoints = period === 'month' ? '5,151 48,119 88,130 126,111 164,98 202,84 242,99 280,91 320,70' : '5,148 58,118 112,128 166,96 220,81 274,95 320,72'

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
        <Legend color="#6750dd" label="Người học hoạt động" />
        <Legend color="#087943" label="Bài học hoàn thành" />
      </Stack>
      <Box component="svg" viewBox="0 0 330 190" preserveAspectRatio="none" sx={{ width: '100%', height: 225, overflow: 'visible' }}>
        {[30, 70, 110, 150].map((y) => <line key={y} x1="5" y1={y} x2="320" y2={y} stroke="#e9e6ef" strokeWidth="1" />)}
        <polyline points={learningPoints} fill="none" stroke="#6750dd" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <polyline points={completionPoints} fill="none" stroke="#087943" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {period === 'month' && <path d={`M5 105 L48 91 L88 110 L126 74 L164 60 L202 51 L242 68 L280 48 L320 29 L320 170 L5 170 Z`} fill="rgba(103,80,221,0.08)" />}
      </Box>
      <Stack direction="row" sx={{ mt: -2, justifyContent: 'space-between' }}>
        {(period === 'month' ? ['01/10', '05/10', '10/10', '15/10', '20/10', '25/10', '31/10'] : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']).map((label) => <Typography key={label} color="text.secondary" sx={{ fontSize: 9 }}>{label}</Typography>)}
      </Stack>
    </Box>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
      <Typography color="text.secondary" sx={{ fontSize: 9 }}>{label}</Typography>
    </Stack>
  )
}
