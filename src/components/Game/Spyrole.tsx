import { Box } from '@mui/material';

export default function SpyRole() {
  return (
    <>
      <Box component="h1">
        당신의 역할은{' '}
        <Box component="span" color="red">
          스파이
        </Box>
        입니다.
      </Box>
    </>
  );
}
