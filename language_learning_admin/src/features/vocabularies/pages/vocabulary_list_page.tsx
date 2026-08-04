import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

import { ConfirmDialog } from '@/components/dialogs/confirm_dialog'
import { EmptyView } from '@/components/feedback/empty_view'
import { VocabularyFilter } from '@/features/vocabularies/components/vocabulary_filter'
import { VocabularyTable } from '@/features/vocabularies/components/vocabulary_table'
import type { Vocabulary, VocabularyFilters } from '@/features/vocabularies/types/vocabulary.types'

const initialFilters: VocabularyFilters = {
  search: '',
  level: 'all',
  topic: 'all',
  lesson: 'all',
  wordType: 'all',
}

const initialItems: Vocabulary[] = [
  { id: '1', korean: '안녕하세요', pronunciation: 'annyeonghaseyo', vietnamese: 'Xin chào', wordType: 'Thán từ', image: '🙋', status: 'active', level: 'beginner', topic: 'greeting', lesson: 'lesson-1' },
  { id: '2', korean: '감사합니다', pronunciation: 'gamsahamnida', vietnamese: 'Cảm ơn', wordType: 'Động từ', image: '💌', status: 'active', level: 'beginner', topic: 'greeting', lesson: 'lesson-1' },
  { id: '3', korean: '미안합니다', pronunciation: 'mianhamnida', vietnamese: 'Xin lỗi', wordType: 'Động từ', image: '', status: 'draft', level: 'beginner', topic: 'greeting', lesson: 'lesson-1' },
]

export function VocabularyListPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [items, setItems] = useState(initialItems)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const filteredItems = useMemo(() => items.filter((item) => {
    const keyword = filters.search.toLocaleLowerCase('vi')
    const matchesSearch = item.korean.includes(filters.search) || item.vietnamese.toLocaleLowerCase('vi').includes(keyword)
    const matchesLevel = filters.level === 'all' || item.level === filters.level
    const matchesTopic = filters.topic === 'all' || item.topic === filters.topic
    const matchesLesson = filters.lesson === 'all' || item.lesson === filters.lesson
    const matchesWordType = filters.wordType === 'all' || (filters.wordType === 'noun' ? item.wordType === 'Danh từ' : item.wordType === 'Động từ')
    return matchesSearch && matchesLevel && matchesTopic && matchesLesson && matchesWordType
  }), [filters, items])

  function updateFilter(field: keyof VocabularyFilters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id])
  }

  function toggleAll(selected: boolean) {
    setSelectedIds(selected ? filteredItems.map((item) => item.id) : [])
  }

  function deleteSelected() {
    setItems((current) => current.filter((item) => !selectedIds.includes(item.id)))
    setSelectedIds([])
    setConfirmDeleteOpen(false)
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography component="h1" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, lineHeight: 1.25, fontWeight: 750 }}>Quản lý từ vựng</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>Quản lý từ vựng tiếng Hàn và bản dịch tiếng Việt</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<FileUploadOutlinedIcon />}>Nhập dữ liệu</Button>
          <Button variant="contained" startIcon={<AddIcon />}>Thêm từ vựng</Button>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <VocabularyFilter filters={filters} onChange={updateFilter} />
          <Stack direction="row" sx={{ mt: 1.2, minHeight: 28, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography color="text.secondary" sx={{ fontSize: 10 }}>Đã chọn {selectedIds.length} mục</Typography>
            <Button color="error" size="small" startIcon={<DeleteOutlineIcon />} disabled={!selectedIds.length} onClick={() => setConfirmDeleteOpen(true)}>Xóa</Button>
          </Stack>
        </Box>
        {filteredItems.length ? (
          <VocabularyTable items={filteredItems} selectedIds={selectedIds} onSelect={toggleSelected} onSelectAll={toggleAll} />
        ) : (
          <Box sx={{ borderTop: '1px solid #efedf4' }}><EmptyView title="Không tìm thấy từ vựng" description="Hãy thử thay đổi bộ lọc tìm kiếm." /></Box>
        )}
      </Paper>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Xóa từ vựng đã chọn?"
        description={`Bạn sắp xóa ${selectedIds.length} từ vựng. Thao tác này không thể hoàn tác.`}
        confirmText="Xóa"
        confirmColor="error"
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={deleteSelected}
      />
    </Stack>
  )
}
