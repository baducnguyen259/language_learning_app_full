import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
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
import type { Vocabulary } from '@/features/vocabularies/types/vocabulary.types'

type VocabularyTableProps = {
  items: Vocabulary[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: (selected: boolean) => void
}

export function VocabularyTable({ items, selectedIds, onSelect, onSelectAll }: VocabularyTableProps) {
  const allSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id))

  return (
    <>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 940 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f3f0ff' }}>
              <TableCell padding="checkbox">
                <Checkbox size="small" checked={allSelected} indeterminate={selectedIds.length > 0 && !allSelected} onChange={(event) => onSelectAll(event.target.checked)} />
              </TableCell>
              <HeaderCell>Từ tiếng Hàn</HeaderCell>
              <HeaderCell>Phiên âm</HeaderCell>
              <HeaderCell>Nghĩa tiếng Việt</HeaderCell>
              <HeaderCell>Loại từ</HeaderCell>
              <HeaderCell>Hình ảnh</HeaderCell>
              <HeaderCell>Trạng thái</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover selected={selectedIds.includes(item.id)}>
                <TableCell padding="checkbox"><Checkbox size="small" checked={selectedIds.includes(item.id)} onChange={() => onSelect(item.id)} /></TableCell>
                <TableCell sx={{ minWidth: 165 }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{item.korean}</Typography>
                    <IconButton aria-label={`Nghe phát âm ${item.korean}`} size="small"><VolumeUpOutlinedIcon sx={{ color: 'primary.main', fontSize: 16 }} /></IconButton>
                  </Stack>
                </TableCell>
                <TableCell><Typography color="text.secondary" sx={{ fontSize: 11 }}>{item.pronunciation}</Typography></TableCell>
                <TableCell><Typography sx={{ fontSize: 12, fontWeight: 600 }}>{item.vietnamese}</Typography></TableCell>
                <TableCell><Chip label={item.wordType} size="small" sx={{ height: 22, color: 'primary.main', bgcolor: '#eeeaff', fontSize: 9, fontWeight: 700 }} /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, border: '1px solid', borderColor: 'divider', borderRadius: 1.2, bgcolor: '#f5f4f8', fontSize: 20 }}>
                    {item.image || <ImageOutlinedIcon sx={{ color: 'text.disabled', fontSize: 19 }} />}
                  </Box>
                </TableCell>
                <TableCell><StatusChip label={item.status === 'active' ? 'Hoạt động' : 'Bản nháp'} tone={item.status === 'active' ? 'success' : 'neutral'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AppPagination total={120} pageSize={12} currentCount={items.length} />
    </>
  )
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <TableCell><Typography sx={{ fontSize: 10, fontWeight: 800 }}>{children}</Typography></TableCell>
}
