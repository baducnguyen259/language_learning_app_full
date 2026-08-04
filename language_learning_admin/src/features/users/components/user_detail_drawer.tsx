import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CloseIcon from '@mui/icons-material/Close'
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined'
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import type { User } from '@/features/users/types/user.types'

type UserDetailDrawerProps = {
  user: User | null
  onClose: () => void
}

const learningSteps = [
  { label: 'Từ vựng Bài 5', status: 'Hoàn thành', complete: true },
  { label: 'Ngữ pháp Bài 5', status: 'Hoàn thành', complete: true },
  { label: 'Quiz Bài 5', status: 'Chưa làm', complete: false },
]

export function UserDetailDrawer({ user, onClose }: UserDetailDrawerProps) {
  const [tab, setTab] = useState(0)

  return (
    <Drawer
      anchor="right"
      open={Boolean(user)}
      onClose={onClose}
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(26, 24, 35, 0.42)' } } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 430 }, maxWidth: '100%' } }}
    >
      {user && (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <Stack direction="row" sx={{ minHeight: 64, px: 2.5, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ece9f2' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 750 }}>Chi tiết người dùng</Typography>
            <IconButton aria-label="Đóng" size="small" onClick={onClose}><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
          </Stack>

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Stack sx={{ px: 2.5, pt: 2.5, alignItems: 'center' }}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: user.avatarColor, fontSize: 20, fontWeight: 800 }}>{user.initials}</Avatar>
              <Typography sx={{ mt: 1.2, fontSize: 17, fontWeight: 800 }}>{user.name}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.2, fontSize: 11 }}>{user.email}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
                <Chip label="Đang hoạt động" size="small" sx={{ height: 22, color: '#108a50', bgcolor: '#dcf8e9', fontSize: 9, fontWeight: 700 }} />
                <Chip label={user.level} size="small" sx={{ height: 22, color: 'primary.main', bgcolor: '#eeeaff', fontSize: 9, fontWeight: 700 }} />
              </Stack>
            </Stack>

            <Tabs value={tab} onChange={(_, value: number) => setTab(value)} variant="fullWidth" sx={{ mt: 2, minHeight: 42, borderBottom: '1px solid #ece9f2', '& .MuiTab-root': { minHeight: 42, fontSize: 11, textTransform: 'none' } }}>
              <Tab label="Tổng quan" />
              <Tab label="Tiến độ" />
              <Tab label="Hoạt động" />
            </Tabs>

            <Stack spacing={2.2} sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={1.5}>
                <StatisticCard icon={<LocalFireDepartmentOutlinedIcon />} value={`${user.streak} Ngày`} label="Chuỗi học tập" color="#e97831" background="#fff4eb" />
                <StatisticCard icon={<StarOutlineOutlinedIcon />} value="92/100" label="Điểm Lingo TB" color="#5b43d6" background="#f1eeff" />
              </Stack>

              <Box>
                <Typography sx={{ mb: 1.2, fontSize: 13, fontWeight: 750 }}>Lộ trình học tập hiện tại</Typography>
                <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5 }}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 750 }}>Sơ cấp 1 - Bài 5: Thời tiết</Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.3, fontSize: 9 }}>{user.course}</Typography>
                    </Box>
                    <Typography color="primary.main" sx={{ fontSize: 10, fontWeight: 800 }}>{user.progress}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={user.progress} sx={{ mt: 1, mb: 1.4, height: 5, borderRadius: 5, bgcolor: '#e9e7ef', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />
                  <Stack spacing={1}>
                    {learningSteps.map((step) => (
                      <Stack key={step.label} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}>
                          {step.complete
                            ? <CheckCircleOutlineOutlinedIcon sx={{ color: '#16a765', fontSize: 15 }} />
                            : <AccessTimeOutlinedIcon sx={{ color: '#9c96a7', fontSize: 15 }} />}
                          <Typography sx={{ fontSize: 10 }}>{step.label}</Typography>
                        </Stack>
                        <Typography color={step.complete ? '#15985a' : 'text.secondary'} sx={{ fontSize: 9 }}>{step.status}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Box>

              <Box>
                <Typography sx={{ mb: 1.2, fontSize: 13, fontWeight: 750 }}>Thông tin tài khoản</Typography>
                <Stack spacing={1.1}>
                  <InfoRow label="Ngày tham gia" value="12/08/2023" />
                  <InfoRow label="Lần đăng nhập cuối" value="Hôm nay, 08:45 AM" />
                  <InfoRow label="Phương thức ĐN" value="Google" />
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} sx={{ p: 2, borderTop: '1px solid #ece9f2' }}>
            <Button fullWidth variant="outlined" color="inherit">Gửi thông báo</Button>
            <Button fullWidth variant="contained" color="error">Khóa tài khoản</Button>
          </Stack>
        </Box>
      )}
    </Drawer>
  )
}

function StatisticCard({ icon, value, label, color, background }: { icon: React.ReactNode; value: string; label: string; color: string; background: string }) {
  return (
    <Paper elevation={0} sx={{ flex: 1, borderRadius: 1.5, p: 1.5, textAlign: 'center', bgcolor: background }}>
      <Box sx={{ color, '& svg': { fontSize: 19 } }}>{icon}</Box>
      <Typography sx={{ mt: 0.3, fontSize: 15, fontWeight: 800 }}>{value}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.2, fontSize: 9 }}>{label}</Typography>
    </Paper>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography color="text.secondary" sx={{ fontSize: 10 }}>{label}</Typography>
        <Typography sx={{ fontSize: 10, fontWeight: 650 }}>{value}</Typography>
      </Stack>
      <Divider />
    </>
  )
}
