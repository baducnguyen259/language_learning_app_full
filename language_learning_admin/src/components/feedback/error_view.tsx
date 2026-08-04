import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { Button, Stack, Typography } from '@mui/material'

type ErrorViewProps = {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  minHeight?: number
}

export function ErrorView({ title = 'Đã xảy ra lỗi', description = 'Không thể tải dữ liệu. Vui lòng thử lại.', retryLabel = 'Thử lại', onRetry, minHeight = 220 }: ErrorViewProps) {
  return (
    <Stack sx={{ minHeight, px: 2, py: 4, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <ErrorOutlineOutlinedIcon sx={{ color: 'error.main', fontSize: 42 }} />
      <Typography sx={{ mt: 1.2, fontWeight: 750 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 380, mt: 0.5, fontSize: 12 }}>{description}</Typography>
      {onRetry && <Button variant="outlined" color="error" onClick={onRetry} sx={{ mt: 2 }}>{retryLabel}</Button>}
    </Stack>
  )
}
