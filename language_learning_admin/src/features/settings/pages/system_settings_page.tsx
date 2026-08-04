import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Avatar, Box, Button, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

const settingsSections = [
  { id: 'profile', label: 'Hồ sơ quản trị viên' },
  { id: 'security', label: 'Tài khoản và bảo mật' },
  { id: 'application', label: 'Cấu hình ứng dụng' },
  { id: 'learning', label: 'Nội dung học tập' },
  { id: 'notifications', label: 'Thông báo' },
  { id: 'roles', label: 'Vai trò và quyền hạn' },
  { id: 'backup', label: 'Sao lưu dữ liệu' },
]

export function SystemSettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function selectAvatar(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography component="h1" sx={{ color: '#20202a', fontSize: { xs: 24, sm: 28 }, lineHeight: 1.25, fontWeight: 750 }}>Cài đặt</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>Quản lý tài khoản và cấu hình hệ thống</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}>
            {settingsSections.map((section) => (
              <Button
                key={section.id}
                fullWidth
                onClick={() => setActiveSection(section.id)}
                sx={{ justifyContent: 'flex-start', minHeight: 41, px: 1.5, color: activeSection === section.id ? 'primary.main' : 'text.secondary', bgcolor: activeSection === section.id ? '#eeeaff' : 'transparent', fontSize: 12, fontWeight: activeSection === section.id ? 750 : 500 }}
              >
                {section.label}
              </Button>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {activeSection === 'profile' ? (
            <Stack spacing={2.5}>
              <SettingsCard title="Hồ sơ quản trị viên">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, alignItems: { sm: 'center' } }}>
                  <Avatar src={avatarUrl} sx={{ width: 72, height: 72, bgcolor: '#6c4ce4', fontSize: 20, fontWeight: 800 }}>AD</Avatar>
                  <Box>
                    <Button component="label" variant="outlined" size="small">
                      Tải ảnh lên
                      <Box component="input" type="file" accept="image/jpeg,image/png" hidden onChange={(event) => selectAvatar(event.target.files?.[0])} />
                    </Button>
                    <Typography color="text.secondary" sx={{ mt: 0.7, fontSize: 10 }}>JPG, GIF hoặc PNG. Tối đa 2MB.</Typography>
                  </Box>
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 1 }}>
                  <ProfileField label="Họ và tên" defaultValue="Nguyễn Văn Admin" />
                  <ProfileField label="Email" defaultValue="admin@lingogo.vn" />
                  <ProfileField label="Số điện thoại" defaultValue="+84 987 654 321" />
                  <ProfileField label="Vai trò" defaultValue="Super Admin" disabled />
                </Grid>
              </SettingsCard>

              <SettingsCard title="Tài khoản và bảo mật">
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1.2}>
                      <PasswordField label="Mật khẩu hiện tại" />
                      <PasswordField label="Mật khẩu mới" value={password} onChange={setPassword} />
                      <PasswordField label="Xác nhận mật khẩu mới" value={confirmPassword} onChange={setConfirmPassword} error={Boolean(confirmPassword) && password !== confirmPassword} />
                      <Button variant="contained" disabled={!password || password !== confirmPassword} sx={{ alignSelf: 'flex-start' }}>Cập nhật mật khẩu</Button>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ height: '100%', borderRadius: 1.5, p: 1.5, bgcolor: '#faf9fd' }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 750 }}>Yêu cầu mật khẩu:</Typography>
                      <Stack spacing={0.8} sx={{ mt: 1 }}>
                        <PasswordRule valid={password.length >= 8}>Ít nhất 8 ký tự</PasswordRule>
                        <PasswordRule valid={/[A-Z]/.test(password)}>Chứa ít nhất một chữ hoa</PasswordRule>
                        <PasswordRule valid={/[0-9]/.test(password)}>Chứa ít nhất một số</PasswordRule>
                        <PasswordRule valid={/[^A-Za-z0-9]/.test(password)}>Chứa ký tự đặc biệt</PasswordRule>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </SettingsCard>
            </Stack>
          ) : (
            <SettingsCard title={settingsSections.find((section) => section.id === activeSection)?.label ?? 'Cài đặt'}>
              <Box sx={{ py: 7, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700 }}>Nội dung cài đặt đang được cập nhật</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>Chọn “Hồ sơ quản trị viên” để quay lại màn thông tin tài khoản.</Typography>
              </Box>
            </SettingsCard>
          )}
        </Grid>
      </Grid>
    </Stack>
  )
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2, sm: 2.5 } }}>
      <Typography sx={{ fontSize: 15, fontWeight: 750 }}>{title}</Typography>
      <Divider sx={{ mt: 1.2 }} />
      {children}
    </Paper>
  )
}

function ProfileField({ label, defaultValue, disabled = false }: { label: string; defaultValue: string; disabled?: boolean }) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography sx={{ mb: 0.6, fontSize: 11, fontWeight: 650 }}>{label}</Typography>
      <TextField fullWidth size="small" defaultValue={defaultValue} disabled={disabled} />
    </Grid>
  )
}

function PasswordField({ label, value, onChange, error = false }: { label: string; value?: string; onChange?: (value: string) => void; error?: boolean }) {
  return (
    <TextField
      fullWidth
      size="small"
      type="password"
      placeholder={label}
      value={value}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      error={error}
      helperText={error ? 'Mật khẩu xác nhận chưa khớp.' : undefined}
    />
  )
}

function PasswordRule({ valid, children }: { valid: boolean; children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={0.7} sx={{ alignItems: 'center', color: valid ? '#15985a' : 'text.secondary' }}>
      {valid ? <CheckIcon sx={{ fontSize: 13 }} /> : <CloseIcon sx={{ fontSize: 13 }} />}
      <Typography sx={{ fontSize: 9 }}>{children}</Typography>
    </Stack>
  )
}
