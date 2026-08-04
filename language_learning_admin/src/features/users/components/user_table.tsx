import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined'
import {
  Avatar,
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
import type { User } from '@/features/users/types/user.types'

type UserTableProps = {
  users: User[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: (checked: boolean) => void
  onUserClick: (user: User) => void
}

export function UserTable({ users, selectedIds, onSelect, onSelectAll, onUserClick }: UserTableProps) {
  const allSelected = users.length > 0 && users.every((user) => selectedIds.includes(user.id))

  return (
    <>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 970 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#faf9fd' }}>
              <TableCell padding="checkbox"><Checkbox size="small" checked={allSelected} indeterminate={selectedIds.length > 0 && !allSelected} onChange={(event) => onSelectAll(event.target.checked)} /></TableCell>
              <HeaderCell>Người dùng</HeaderCell>
              <HeaderCell>Khóa học</HeaderCell>
              <HeaderCell>Tiến độ</HeaderCell>
              <HeaderCell>Chuỗi</HeaderCell>
              <HeaderCell>Trạng thái</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover selected={selectedIds.includes(user.id)} onClick={() => onUserClick(user)} sx={{ cursor: 'pointer' }}>
                <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
                  <Checkbox size="small" checked={selectedIds.includes(user.id)} onChange={() => onSelect(user.id)} />
                </TableCell>
                <TableCell sx={{ minWidth: 250 }}>
                  <Stack direction="row" spacing={1.3} sx={{ alignItems: 'center' }}>
                    <Avatar sx={{ width: 38, height: 38, bgcolor: user.avatarColor, fontSize: 12, fontWeight: 800 }}>{user.initials}</Avatar>
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 750 }}>{user.name}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.2, fontSize: 10 }}>{user.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 11, fontWeight: 650 }}>{user.course}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 10 }}>{user.level}</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 165 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <LinearProgress
                      variant="determinate"
                      value={user.progress}
                      sx={{ width: 95, height: 6, borderRadius: 5, bgcolor: '#e9e7ef', '& .MuiLinearProgress-bar': { bgcolor: user.progress < 20 ? '#ef6570' : user.progress < 60 ? 'primary.main' : '#18a967' } }}
                    />
                    <Typography sx={{ fontSize: 10, fontWeight: 700 }}>{user.progress}%</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip icon={<LocalFireDepartmentOutlinedIcon />} label={user.streak} size="small" sx={{ height: 24, color: '#d9702a', bgcolor: '#fff0e5', fontSize: 10, fontWeight: 750, '& .MuiChip-icon': { color: 'inherit', fontSize: 14 } }} />
                </TableCell>
                <TableCell><StatusChip label={user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'} tone={user.status === 'active' ? 'success' : 'error'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AppPagination total={1248} currentCount={users.length} itemLabel="người dùng" />
    </>
  )
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <TableCell><Typography sx={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.35 }}>{children}</Typography></TableCell>
}
