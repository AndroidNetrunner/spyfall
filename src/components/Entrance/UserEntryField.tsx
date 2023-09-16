import { TextField } from '@mui/material';

interface CustomInputProps {
  label: string;
  handler: (value: string) => void;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  name?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  required?: boolean;
  autoFocus?: boolean;
}

export default function UserEntryFIeld({
  label,
  handler,
  error = false,
  helperText = '',
  maxLength,
  name,
  color = 'primary',
  required = false,
  autoFocus = false,
}: CustomInputProps) {
  return (
    <TextField
      margin="normal"
      color={color}
      helperText={helperText}
      inputProps={{ maxLength }}
      error={error}
      name={name}
      label={label}
      required={required}
      autoFocus={autoFocus}
      onChange={event => handler(event.target.value)}
    />
  );
}
