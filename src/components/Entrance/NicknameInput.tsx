import { TextField } from '@mui/material';

export default function NicknameInput({ onChange }: { onChange: (value: string) => void }) {
  return (
    <TextField
      margin="normal"
      required
      inputProps={{ maxLength: 8 }}
      id="nickname"
      label="닉네임"
      name="nickname"
      autoFocus
      onChange={event => onChange(event.target.value)}
    />
  );
}
