import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined'
import { Paper, Stack, Typography } from '@mui/material'

interface FeaturePlaceholderProps {
  title: string
}

export function FeaturePlaceholder({ title }: FeaturePlaceholderProps) {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 4 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <ConstructionOutlinedIcon color="primary" sx={{ fontSize: 48 }} />
        <Typography component="h2" variant="h5">
          {title}
        </Typography>
        <Typography color="text.secondary">Module đã sẵn sàng để phát triển nghiệp vụ.</Typography>
      </Stack>
    </Paper>
  )
}
