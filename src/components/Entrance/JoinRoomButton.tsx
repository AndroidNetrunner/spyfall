import { Button } from '@mui/material';

export default function JoinRoomButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <Button onClick={onClick} variant="outlined" color="success" sx={{ ml: 3, mt: 3, mb: 2 }} disabled={disabled}>
      방 참가
    </Button>
  );
}
