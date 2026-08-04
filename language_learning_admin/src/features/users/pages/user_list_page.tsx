import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

import { EmptyView } from '@/components/feedback/empty_view'
import { UserFilter } from '@/features/users/components/user_filter'
import { UserDetailDrawer } from '@/features/users/components/user_detail_drawer'
import { UserTable } from '@/features/users/components/user_table'
import type { User, UserFilters } from '@/features/users/types/user.types'

const initialFilters: UserFilters = { search: '', level: 'all', language: 'all', status: 'all' }

const users: User[] = [
  { id: '1', name: 'Nguyễn Minh Anh', email: 'minhanh.ng@example.com', initials: 'NA', avatarColor: '#806eaf', course: 'Tiếng Hàn', level: 'Sơ cấp 1', progress: 85, streak: 15, status: 'active' },
  { id: '2', name: 'Trần Hoàng Nam', email: 'hoangnam.tran@example.com', initials: 'TN', avatarColor: '#3992e6', course: 'Tiếng Hàn', level: 'Trung cấp 1', progress: 48, streak: 3, status: 'active' },
  { id: '3', name: 'Lê Thu Hà', email: 'thuha.le92@example.com', initials: 'LH', avatarColor: '#b78964', course: 'Tiếng Hàn', level: 'Sơ cấp 2', progress: 92, streak: 42, status: 'active' },
  { id: '4', name: 'Phạm Gia Huy', email: 'giahuy.pham@example.com', initials: 'PH', avatarColor: '#d3c1c8', course: 'Tiếng Hàn', level: 'Sơ cấp 1', progress: 10, streak: 0, status: 'locked' },
]

const statistics = [
  { label: 'Tổng người dùng', value: '1.248', icon: <GroupsOutlinedIcon />, color: '#5b43d6', background: '#eee9ff' },
  { label: 'Hoạt động (30 ngày)', value: '386', badge: 'Đang hoạt động', icon: <CheckCircleOutlineOutlinedIcon />, color: '#15985a', background: '#ddf8e9' },
  { label: 'Người dùng mới', value: '24', badge: '+12% tháng này', icon: <PersonAddAltOutlinedIcon />, color: '#3078dc', background: '#e5f0ff' },
  { label: 'Đã khóa', value: '8', icon: <LockOutlinedIcon />, color: '#d34b56', background: '#fde8ea' },
]

export function UserListPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailUser, setDetailUser] = useState<User | null>(null)

  const filteredUsers = useMemo(() => users.filter((user) => {
    const keyword = filters.search.toLocaleLowerCase('vi')
    const matchesSearch = user.name.toLocaleLowerCase('vi').includes(keyword) || user.email.toLocaleLowerCase('vi').includes(keyword)
    const matchesLevel = filters.level === 'all' || user.level === 'Sơ cấp 1'
    const matchesLanguage = filters.language === 'all' || user.course === 'Tiếng Hàn'
    const matchesStatus = filters.status === 'all' || user.status === filters.status
    return matchesSearch && matchesLevel && matchesLanguage && matchesStatus
  }), [filters])

  function updateFilter(field: keyof UserFilters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((userId) => userId !== id) : [...current, id])
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography component="h1" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, lineHeight: 1.25, fontWeight: 750 }}>Quản lý người dùng</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>Theo dõi tài khoản và tiến độ học tập</Typography>
        </Box>
        <Button variant="contained" startIcon={<DownloadOutlinedIcon />} sx={{ minHeight: 42, px: 2.5, alignSelf: { xs: 'flex-start', sm: 'center' } }}>Xuất danh sách</Button>
      </Stack>

      <Grid container spacing={2}>
        {statistics.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, xl: 3 }}>
            <Paper elevation={0} sx={{ height: '100%', minHeight: 125, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: '50%', color: item.color, bgcolor: item.background, '& svg': { fontSize: 19 } }}>{item.icon}</Box>
                {item.badge && <Chip icon={item.badge.startsWith('+') ? <TrendingUpIcon /> : undefined} label={item.badge} size="small" sx={{ height: 22, color: item.color, bgcolor: item.background, fontSize: 9, fontWeight: 700, '& .MuiChip-icon': { color: 'inherit', fontSize: 13 } }} />}
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 1.2, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.45 }}>{item.label}</Typography>
              <Typography sx={{ mt: 0.3, fontSize: 23, lineHeight: 1, fontWeight: 800 }}>{item.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}><UserFilter filters={filters} onChange={updateFilter} /></Box>
        {filteredUsers.length ? (
          <UserTable
            users={filteredUsers}
            selectedIds={selectedIds}
            onSelect={toggleSelected}
            onSelectAll={(checked) => setSelectedIds(checked ? filteredUsers.map((user) => user.id) : [])}
            onUserClick={setDetailUser}
          />
        ) : (
          <Box sx={{ borderTop: '1px solid #efedf4' }}><EmptyView title="Không tìm thấy người dùng" description="Hãy thử thay đổi bộ lọc tìm kiếm." /></Box>
        )}
      </Paper>
      <UserDetailDrawer user={detailUser} onClose={() => setDetailUser(null)} />
    </Stack>
  )
}
