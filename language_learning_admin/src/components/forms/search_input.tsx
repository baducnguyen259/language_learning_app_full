import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

export type SearchInputProps = Omit<TextFieldProps, 'type'> & {
  onSearchChange?: (value: string) => void
}

export function SearchInput({ onChange, onSearchChange, placeholder = 'Tìm kiếm...', size = 'small', slotProps, ...props }: SearchInputProps) {
  return (
    <TextField
      {...props}
      type="search"
      size={size}
      placeholder={placeholder}
      onChange={(event) => {
        onChange?.(event)
        onSearchChange?.(event.target.value)
      }}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment>,
        },
      }}
    />
  )
}
