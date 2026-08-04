import { Button, CircularProgress } from '@mui/material'
import type { ButtonProps } from '@mui/material'

export type LoadingButtonProps = ButtonProps & {
  loading?: boolean
  loadingText?: string
}

export function LoadingButton({ children, disabled, loading = false, loadingText, startIcon, ...props }: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress color="inherit" size={16} /> : startIcon}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  )
}
