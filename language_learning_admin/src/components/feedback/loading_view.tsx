import { CircularProgress, Skeleton, Stack } from '@mui/material'

type LoadingViewProps = {
  variant?: 'spinner' | 'skeleton'
  rows?: number
  minHeight?: number
}

export function LoadingView({ variant = 'spinner', rows = 4, minHeight = 220 }: LoadingViewProps) {
  if (variant === 'skeleton') {
    return <Stack spacing={1.2} sx={{ minHeight, p: 2, justifyContent: 'center' }}>{Array.from({ length: rows }, (_, index) => <Skeleton key={index} height={42} variant="rounded" />)}</Stack>
  }

  return <Stack sx={{ minHeight, alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={32} /></Stack>
}
