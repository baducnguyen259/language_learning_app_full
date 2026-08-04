import { Pagination, Stack, Typography } from '@mui/material'

type AppPaginationProps = {
  total: number
  pageSize?: number
  page?: number
  currentCount?: number
  itemLabel?: string
  onPageChange?: (page: number) => void
}

export function AppPagination({ total, pageSize = 10, page = 1, currentCount, itemLabel = 'kết quả', onPageChange }: AppPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = currentCount === undefined ? Math.min(page * pageSize, total) : Math.min(from + currentCount - 1, total)

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ px: 2, py: 1.5, alignItems: { sm: 'center' }, justifyContent: 'space-between', borderTop: '1px solid #efedf4' }}>
      <Typography color="text.secondary" sx={{ fontSize: 10 }}>Hiển thị {from}–{to} trên {total.toLocaleString('vi-VN')} {itemLabel}</Typography>
      <Pagination count={pageCount} page={Math.min(page, pageCount)} onChange={(_, value) => onPageChange?.(value)} size="small" color="primary" shape="rounded" siblingCount={1} />
    </Stack>
  )
}
