import { Button, ButtonProps } from '@mui/material';

interface EntryButtonProps extends ButtonProps {
  label: string;
  buttonColor?: 'inherit' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning';
}

export default function EntryButton({ label, buttonColor = 'primary', ...props }: EntryButtonProps) {
  return (
    <Button variant="outlined" color={buttonColor} sx={{ ml: 3, mt: 3, mb: 2 }} {...props}>
      {label}
    </Button>
  );
}
