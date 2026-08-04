import { CssBaseline, ThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'

import { appTheme } from '@/app/theme/app_theme'
import { QueryProvider } from '@/app/providers/query_provider'

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryProvider>
  )
}
