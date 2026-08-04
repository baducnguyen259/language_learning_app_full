import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f5ff', p: { xs: 0, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.25fr 1fr' },
          width: '100%',
          maxWidth: 1180,
          minHeight: { xs: '100vh', md: 690 },
          mx: 'auto',
          overflow: 'hidden',
          border: { xs: 0, md: '1px solid' },
          borderColor: 'divider',
          borderRadius: { xs: 0, md: 2 },
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', overflow: 'hidden', p: { md: 5, lg: 6 }, bgcolor: '#f7f4ff' }}>
          <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
            <Box component="img" src="/logo.svg" alt="LingoGo Admin" sx={{ width: 38, height: 38 }} />
            <Typography color="primary.main" sx={{ fontSize: 19, fontWeight: 800 }}>LingoGo Admin</Typography>
          </Stack>

          <Typography sx={{ mt: 6, maxWidth: 480, fontSize: { md: 25, lg: 28 }, lineHeight: 1.25, fontWeight: 800 }}>
            Quản lý nội dung học tập hiệu quả
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.8, maxWidth: 460, fontSize: 13, lineHeight: 1.6 }}>
            Xây dựng bài học, quản lý người dùng và theo dõi tiến độ học tập trên cùng một hệ thống.
          </Typography>

          <Box sx={{ position: 'relative', width: '84%', height: 285, mt: 4, mx: 'auto' }}>
            <Box sx={{ position: 'absolute', inset: '20px 5% 0', borderRadius: '50%', bgcolor: 'rgba(111, 221, 181, 0.2)', filter: 'blur(25px)' }} />
            <Paper elevation={8} sx={{ position: 'absolute', inset: '20px 0 18px', overflow: 'hidden', borderRadius: 2.5, transform: 'perspective(800px) rotateX(4deg)', boxShadow: '0 24px 50px rgba(45, 38, 80, 0.18)' }}>
              <Stack direction="row" spacing={0.7} sx={{ height: 28, px: 1.2, alignItems: 'center', bgcolor: '#ece9f6' }}>
                {['#f1777e', '#f0bd52', '#65c980'].map((color) => <Box key={color} sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }} />)}
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: '78px 1fr', height: 'calc(100% - 28px)' }}>
                <Box sx={{ p: 1.2, bgcolor: '#5b43d6' }}>
                  <Box sx={{ width: 28, height: 8, borderRadius: 3, bgcolor: 'rgba(255,255,255,.9)' }} />
                  {[1, 2, 3, 4].map((item) => <Box key={item} sx={{ width: item === 2 ? 48 : 42, height: 6, mt: 2.2, borderRadius: 3, bgcolor: item === 2 ? '#68e69a' : 'rgba(255,255,255,.35)' }} />)}
                </Box>
                <Box sx={{ p: 2, bgcolor: '#fbfaff' }}>
                  <Box sx={{ width: 90, height: 9, borderRadius: 3, bgcolor: '#25222e' }} />
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <MiniMetric icon={<PeopleOutlinedIcon />} color="#6750dd" />
                    <MiniMetric icon={<MenuBookOutlinedIcon />} color="#19a968" />
                    <MiniMetric icon={<TranslateOutlinedIcon />} color="#e0a41d" />
                  </Stack>
                  <Box sx={{ position: 'relative', height: 102, mt: 2, borderRadius: 1.5, bgcolor: '#f1eff8' }}>
                    {[18, 36, 54, 72].map((top) => <Box key={top} sx={{ position: 'absolute', top, left: 12, right: 12, height: 1, bgcolor: '#ddd9e8' }} />)}
                    <Box component="svg" viewBox="0 0 240 90" preserveAspectRatio="none" sx={{ position: 'absolute', inset: 8, width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}>
                      <polyline points="0,70 40,55 80,62 120,32 160,42 200,18 240,25" fill="none" stroke="#5b43d6" strokeWidth="3" />
                      <polyline points="0,76 40,70 80,48 120,58 160,38 200,48 240,30" fill="none" stroke="#16a765" strokeWidth="3" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
            <FloatingIcon icon={<AutoGraphOutlinedIcon />} sx={{ right: -18, top: 0, color: '#16a765' }} />
            <FloatingIcon icon={<TranslateOutlinedIcon />} sx={{ left: -18, bottom: 10, color: '#5b43d6' }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', px: { xs: 2.5, sm: 7, md: 5, lg: 7 }, py: { xs: 4, md: 5 }, bgcolor: '#fff' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 5, alignItems: 'center', gap: 1 }}>
            <Box component="img" src="/logo.svg" alt="LingoGo Admin" sx={{ width: 34, height: 34 }} />
            <Typography color="primary.main" sx={{ fontWeight: 800 }}>LingoGo Admin</Typography>
          </Box>
          <Box sx={{ width: '100%', maxWidth: 410, m: 'auto' }}><Outlet /></Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 5, color: 'text.secondary', alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 9 }}>© 2026 LingoGo. Đã đăng ký bản quyền.</Typography>
            <Stack direction="row" spacing={2}>
              <Typography component="a" href="#" sx={{ fontSize: 9 }}>Chính sách bảo mật</Typography>
              <Typography component="a" href="#" sx={{ fontSize: 9 }}>Điều khoản sử dụng</Typography>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

function MiniMetric({ icon, color }: { icon: React.ReactNode; color: string }) {
  return (
    <Box sx={{ flex: 1, height: 52, borderRadius: 1.3, p: 1, bgcolor: '#fff', boxShadow: '0 3px 12px rgba(42,35,71,.08)' }}>
      <Box sx={{ color, '& svg': { fontSize: 14 } }}>{icon}</Box>
      <Box sx={{ width: '55%', height: 5, mt: 1, borderRadius: 3, bgcolor: '#d9d5e2' }} />
    </Box>
  )
}

function FloatingIcon({ icon, sx }: { icon: React.ReactNode; sx: Record<string, unknown> }) {
  return <Box sx={{ position: 'absolute', display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: 2, bgcolor: '#fff', boxShadow: '0 8px 24px rgba(43,35,77,.16)', '& svg': { fontSize: 25 }, ...sx }}>{icon}</Box>
}
