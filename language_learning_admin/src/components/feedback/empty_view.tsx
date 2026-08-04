import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type EmptyViewProps = {
  title?: string
  description?: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
  minHeight?: number
}

export function EmptyView({ title = 'Không có dữ liệu', description, icon, actionLabel, onAction, minHeight = 220 }: EmptyViewProps) {
  return (
    <Stack sx={{ minHeight, px: 2, py: 4, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box sx={{ display: 'grid', placeItems: 'center', width: 52, height: 52, borderRadius: '50%', color: 'primary.main', bgcolor: '#eeeaff', '& svg': { fontSize: 26 } }}>
        {icon ?? <InboxOutlinedIcon />}
      </Box>
      <Typography sx={{ mt: 1.5, fontWeight: 750 }}>{title}</Typography>
      {description && <Typography color="text.secondary" sx={{ maxWidth: 380, mt: 0.5, fontSize: 12 }}>{description}</Typography>}
      {actionLabel && onAction && <Button variant="outlined" onClick={onAction} sx={{ mt: 2 }}>{actionLabel}</Button>}
    </Stack>
  )
}
