import { Chip } from '@mui/material'
import type { ChipProps } from '@mui/material'

export type StatusTone = 'success' | 'primary' | 'warning' | 'error' | 'neutral'

const toneStyles: Record<StatusTone, { color: string; background: string }> = {
  success: { color: '#108a50', background: '#ddf8e9' },
  primary: { color: '#5b43d6', background: '#eeeaff' },
  warning: { color: '#9b5b23', background: '#fff0e3' },
  error: { color: '#c8404b', background: '#fde8ea' },
  neutral: { color: '#696474', background: '#f0eef3' },
}

export type StatusChipProps = Omit<ChipProps, 'color'> & {
  tone?: StatusTone
}

export function StatusChip({ tone = 'neutral', size = 'small', sx, ...props }: StatusChipProps) {
  const style = toneStyles[tone]
  return <Chip {...props} size={size} sx={{ height: 22, color: style.color, bgcolor: style.background, fontSize: 9, fontWeight: 700, ...sx }} />
}
