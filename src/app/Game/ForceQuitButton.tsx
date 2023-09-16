import useHandler from '@/app/hooks/useHandler';
import { Button } from '@mui/material';

export default function ForceQuitButton() {
  const { handleQuit } = useHandler();
  return (
    <Button color="error" variant="outlined" onClick={handleQuit}>
      강제 종료
    </Button>
  );
}
