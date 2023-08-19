import { Button } from '@mui/material';

export default function CreateRoomButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <Button onClick={onClick} variant="outlined" sx={{ ml: 3, mt: 3, mb: 2 }} disabled={disabled}>
      방 생성
    </Button>
  );
}
