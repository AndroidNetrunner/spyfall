import { Box, Button } from '@mui/material';

interface ResetButtonsProps {
  onReset: () => void;
  onRejoin: () => void;
}

export default function ResetButtons({ onReset, onRejoin }: ResetButtonsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Button variant="outlined" onClick={onReset}>
        처음으로
      </Button>
      <Button variant="outlined" color="success" onClick={onRejoin}>
        다시 하기
      </Button>
    </Box>
  );
}
