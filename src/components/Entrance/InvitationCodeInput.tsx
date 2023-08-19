import { TextField } from '@mui/material';

export default function InvitationCodeInput({
  onChange,
  error,
  helperText,
}: {
  onChange: (value: string) => void;
  error: boolean;
  helperText: string;
}) {
  return (
    <TextField
      margin="normal"
      color="success"
      helperText={helperText}
      inputProps={{ maxLength: 6 }}
      error={error}
      name="invitationCode"
      label="초대 코드"
      onChange={event => onChange(event.target.value)}
    />
  );
}
