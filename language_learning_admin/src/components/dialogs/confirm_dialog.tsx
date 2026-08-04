import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'success'
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'primary',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontSize: 17, fontWeight: 750 }}>{title}</DialogTitle>
      {description && <DialogContent><Typography color="text.secondary" sx={{ fontSize: 13 }}>{description}</Typography></DialogContent>}
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" disabled={loading} onClick={onClose}>{cancelText}</Button>
        <Button color={confirmColor} disabled={loading} variant="contained" onClick={onConfirm}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  )
}
