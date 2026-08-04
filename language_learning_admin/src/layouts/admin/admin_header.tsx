import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { AppBar, Avatar, Badge, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import { useLocation } from 'react-router'

import { ADMIN_SIDEBAR_WIDTH } from '@/layouts/admin/admin_sidebar'
import { SearchInput } from '@/components/forms/search_input'

export function AdminHeader() {
  const { pathname } = useLocation()
  const currentPage = pathname.startsWith('/curriculums')
    ? 'Lộ trình'
    : pathname.startsWith('/settings')
      ? 'Cài đặt hệ thống'
    : pathname.startsWith('/reports')
      ? 'Báo cáo học tập'
    : pathname.startsWith('/users')
      ? 'Người dùng'
    : pathname.startsWith('/vocabularies')
      ? 'Từ vựng'
    : pathname === '/lessons/new'
      ? 'Thêm bài học'
      : pathname.startsWith('/lessons')
        ? 'Bài học'
      : pathname === '/dashboard'
          ? 'Tổng quan'
          : 'Quản trị'

  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="fixed"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'rgba(255,255,255,0.96)',
        ml: { md: `${ADMIN_SIDEBAR_WIDTH}px` },
        width: { md: `calc(100% - ${ADMIN_SIDEBAR_WIDTH}px)` },
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
        <IconButton aria-label="Mở menu" edge="start" sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>Trang chủ</Typography>
          <Typography color="text.disabled" sx={{ fontSize: 13 }}>/</Typography>
          <Typography color="primary.main" sx={{ fontSize: 13, fontWeight: 700 }}>{currentPage}</Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <SearchInput
          size="small"
          placeholder="Tìm kiếm toàn cầu"
          sx={{
            width: { xs: 150, sm: 260 },
            '& .MuiOutlinedInput-root': { height: 38, borderRadius: 5, bgcolor: '#faf9fc', fontSize: 12 },
          }}
        />
        <IconButton aria-label="Thông báo" size="small">
          <Badge color="error" variant="dot"><NotificationsNoneOutlinedIcon /></Badge>
        </IconButton>
        <Avatar sx={{ width: 35, height: 35, bgcolor: '#d9c5ad', color: '#514334', fontSize: 13 }}>AD</Avatar>
      </Toolbar>
    </AppBar>
  )
}
