import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SpellcheckOutlinedIcon from '@mui/icons-material/SpellcheckOutlined'
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import { Avatar, Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router'

export const ADMIN_SIDEBAR_WIDTH = 248

const navigationGroups = [
  {
    title: '',
    items: [{ label: 'Tổng quan', path: '/dashboard', icon: <DashboardOutlinedIcon /> }],
  },
  {
    title: 'Quản lý',
    items: [
      { label: 'Ngôn ngữ', path: '/languages', icon: <LanguageOutlinedIcon /> },
      { label: 'Lộ trình', path: '/curriculums', icon: <RouteOutlinedIcon /> },
      { label: 'Cấp độ', path: '/levels', icon: <LeaderboardOutlinedIcon /> },
      { label: 'Chủ đề', path: '/topics', icon: <CategoryOutlinedIcon /> },
      { label: 'Bài học', path: '/lessons', icon: <MenuBookOutlinedIcon /> },
      { label: 'Từ vựng', path: '/vocabularies', icon: <TranslateOutlinedIcon /> },
      { label: 'Ngữ pháp', path: '/grammars', icon: <SpellcheckOutlinedIcon /> },
      { label: 'Quiz', path: '/quizzes', icon: <QuizOutlinedIcon /> },
      { label: 'Người dùng', path: '/users', icon: <GroupsOutlinedIcon /> },
      { label: 'Báo cáo', path: '/reports', icon: <AssessmentOutlinedIcon /> },
    ],
  },
  {
    title: 'Hệ thống',
    items: [{ label: 'Cài đặt', path: '/settings', icon: <SettingsOutlinedIcon /> }],
  },
]

export function AdminSidebar() {
  return (
    <Drawer
      open
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: ADMIN_SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: ADMIN_SIDEBAR_WIDTH, borderRight: '1px solid', borderColor: 'divider', bgcolor: '#fff' },
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', gap: 1.2, px: '20px !important' }}>
        <Box component="img" src="/logo.svg" alt="LingoGo" sx={{ width: 38, height: 38 }} />
        <Box>
          <Typography sx={{ color: 'primary.main', fontSize: 16, lineHeight: 1.15, fontWeight: 800 }}>LingoGo</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.2, fontSize: 9 }}>Admin Dashboard</Typography>
        </Box>
      </Toolbar>

      <Box sx={{ px: 1.5, pb: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {navigationGroups.map((group) => (
          <Box key={group.title || 'overview'} sx={{ mt: group.title ? 1.5 : 0.5 }}>
            {group.title && (
              <Typography color="text.secondary" sx={{ px: 1.5, mb: 0.7, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.75 }}>
                {group.title}
              </Typography>
            )}
            <List disablePadding>
              {group.items.map((item) => (
                <ListItemButton
                  component={NavLink}
                  key={item.path}
                  to={item.path}
                  sx={{
                    minHeight: 41,
                    px: 1.5,
                    py: 0.7,
                    borderRadius: 1.5,
                    mb: 0.3,
                    color: '#5d5668',
                    '& .MuiListItemIcon-root': { color: '#716a7d' },
                    '&:hover': { bgcolor: '#f3f0fc', color: '#5542cb' },
                    '&:hover .MuiListItemIcon-root': { color: '#6c5ce7' },
                    '&.active': { bgcolor: '#68e69a', color: '#175c38', fontWeight: 800 },
                    '&.active:hover': { bgcolor: '#5cdd90' },
                    '&.active .MuiListItemIcon-root': { color: '#175c38' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34, '& svg': { fontSize: 19 } }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 'inherit' } } }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}

        <Box sx={{ mt: 'auto', px: 1 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>A</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 12, fontWeight: 750 }}>Admin LingoGo</Typography>
              <Typography noWrap color="text.secondary" sx={{ fontSize: 9 }}>Quản trị viên</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}
