import AddIcon from '@mui/icons-material/Add'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

type LessonFormProps = {
  onCancel: () => void
}

type ContentBlock = {
  id: number
  title: string
  description: string
  type: 'intro' | 'vocabulary' | 'content'
  status: string
}

const initialBlocks: ContentBlock[] = [
  { id: 1, title: 'Giới thiệu bài học', description: 'Văn bản giới thiệu mục tiêu bài học...', type: 'intro', status: 'Hoàn tất' },
  { id: 2, title: 'Từ vựng: Chào hỏi', description: 'Danh sách 10 từ vựng cơ bản kèm audio...', type: 'vocabulary', status: 'Bản nháp' },
]

export function LessonForm({ onCancel }: LessonFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [publicationStatus, setPublicationStatus] = useState('draft')
  const [prerequisite, setPrerequisite] = useState(true)
  const [replay, setReplay] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [blocks, setBlocks] = useState(initialBlocks)

  const hasTitleError = submitted && !title.trim()

  function handlePublish() {
    setSubmitted(true)
    if (!title.trim()) return
  }

  function addBlock() {
    setBlocks((current) => [
      ...current,
      { id: Date.now(), title: 'Khối nội dung mới', description: 'Chưa có nội dung...', type: 'content', status: 'Bản nháp' },
    ])
  }

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={2}>
            <SectionCard>
              <SectionTitle icon={<ErrorOutlineIcon />}>Thông tin cơ bản</SectionTitle>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <FieldLabel required>Tên bài học</FieldLabel>
                  <TextField
                    fullWidth
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    error={hasTitleError}
                    placeholder="Nhập tên bài học (VD: Bài 1: Xin chào)"
                    size="small"
                    helperText={hasTitleError ? 'Vui lòng nhập tên bài học.' : undefined}
                  />
                </Box>
                <Box>
                  <FieldLabel>Mô tả ngắn gọn</FieldLabel>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Mô tả nội dung bài học..."
                  />
                </Box>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FieldLabel>Ngôn ngữ</FieldLabel>
                    <FormControl fullWidth size="small">
                      <Select defaultValue="korean"><MenuItem value="korean">Tiếng Hàn</MenuItem></Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FieldLabel>Cấp độ</FieldLabel>
                    <FormControl fullWidth size="small">
                      <Select defaultValue="beginner"><MenuItem value="beginner">Sơ cấp 1</MenuItem></Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Stack>
            </SectionCard>

            <SectionCard>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <SectionTitle icon={<AutoStoriesOutlinedIcon />}>Nội dung bài học</SectionTitle>
                <Button size="small" startIcon={<AddIcon />} onClick={addBlock}>Thêm khối</Button>
              </Stack>
              <Stack spacing={1.2} sx={{ mt: 2 }}>
                {blocks.map((block) => (
                  <ContentBlockCard key={block.id} block={block} />
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addBlock}
                  sx={{ minHeight: 74, borderStyle: 'dashed', color: 'text.secondary', bgcolor: '#fff' }}
                >
                  Thêm khối nội dung mới
                </Button>
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2}>
            <SectionCard>
              <Typography sx={{ fontSize: 13, fontWeight: 750 }}>Trạng thái xuất bản</Typography>
              <RadioGroup value={publicationStatus} onChange={(event) => setPublicationStatus(event.target.value)} sx={{ mt: 1.3, gap: 0.8 }}>
                <PublicationOption value="draft" label="Bản nháp" />
                <PublicationOption value="scheduled" label="Hẹn giờ xuất bản" />
                <PublicationOption value="published" label="Xuất bản ngay" />
              </RadioGroup>
            </SectionCard>

            <SectionCard>
              <Typography sx={{ fontSize: 13, fontWeight: 750 }}>Cấu hình bài học</Typography>
              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                <SettingSwitch
                  title="Bắt buộc học bài trước"
                  description="Khóa học viên nếu chưa hoàn thành"
                  checked={prerequisite}
                  onChange={setPrerequisite}
                />
                <SettingSwitch
                  title="Cho phép học lại"
                  description="Học viên có thể làm lại bài"
                  checked={replay}
                  onChange={setReplay}
                />
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: { xs: 2, sm: 2.5 }, py: 1.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
          <Button color="error" onClick={onCancel} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>Hủy bỏ</Button>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined">Xem trước</Button>
            <Button variant="contained" onClick={handlePublish}>Xuất bản</Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2, sm: 2.5 } }}>{children}</Paper>
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: '#282631' }}>
      <Box sx={{ display: 'grid', placeItems: 'center', color: 'primary.main', '& svg': { fontSize: 19 } }}>{icon}</Box>
      <Typography sx={{ fontSize: 13, fontWeight: 750 }}>{children}</Typography>
    </Stack>
  )
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Typography sx={{ mb: 0.7, fontSize: 12, fontWeight: 700 }}>
      {children}{required && <Box component="span" sx={{ color: 'error.main' }}> *</Box>}
    </Typography>
  )
}

function ContentBlockCard({ block }: { block: ContentBlock }) {
  const isComplete = block.status === 'Hoàn tất'
  const icon = block.type === 'intro' ? <DescriptionOutlinedIcon /> : block.type === 'vocabulary' ? <RecordVoiceOverOutlinedIcon /> : <AutoStoriesOutlinedIcon />

  return (
    <Stack direction="row" spacing={1.3} sx={{ alignItems: 'center', p: 1.5, border: '1px solid #ece9f2', borderRadius: 1.5, bgcolor: '#fbfaff' }}>
      <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 18, cursor: 'grab' }} />
      <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, flexShrink: 0, borderRadius: 1.2, color: 'primary.main', bgcolor: '#eeeaff', '& svg': { fontSize: 19 } }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography noWrap sx={{ fontSize: 12, fontWeight: 700 }}>{block.title}</Typography>
        <Typography noWrap color="text.secondary" sx={{ mt: 0.2, fontSize: 10 }}>{block.description}</Typography>
      </Box>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: isComplete ? '#14945a' : '#756e82', bgcolor: isComplete ? '#e1f8eb' : '#efedf3', borderRadius: 5, px: 1, py: 0.45 }}>
        {isComplete && <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 12 }} />}
        <Typography sx={{ fontSize: 9, fontWeight: 700 }}>{block.status}</Typography>
      </Stack>
    </Stack>
  )
}

function PublicationOption({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, px: 1, bgcolor: '#fbfaff' }}>
      <FormControlLabel value={value} control={<Radio size="small" />} label={label} sx={{ m: 0, width: '100%', '& .MuiFormControlLabel-label': { fontSize: 12 } }} />
    </Box>
  )
}

function SettingSwitch({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.2, fontSize: 9 }}>{description}</Typography>
      </Box>
      <Switch size="small" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </Stack>
  )
}
