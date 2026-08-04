import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router'

import { AdminHeader } from '@/layouts/admin/admin_header'
import { AdminSidebar } from '@/layouts/admin/admin_sidebar'

export function AdminLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminHeader />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Box sx={{ maxWidth: 1440, mx: 'auto', pt: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
