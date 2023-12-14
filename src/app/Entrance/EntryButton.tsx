import { Button, ButtonProps } from '@mui/material';

interface EntryButtonProps extends ButtonProps {
  label: string;
  buttonColor?: 'inherit' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';
}

export default function EntryButton({ label, buttonColor = 'primary', ...props }: EntryButtonProps) {
  return (
    <Button variant="outlined" color={buttonColor} sx={{ mt: 3 }} {...props}>
      {label}
    </Button>
  );
}
