import { Box, Container } from '@mui/material';
import useGameStartSync from '@/hooks/useGameStartSync';
import { useSelector } from 'react-redux';
import { selectSpy } from '@/redux/slices/gameSlice';
import RoleInfo from './RoleInfo/RoleInfo';
import useGameRenderer from '@/hooks/useGameRenderer';

export default function Game() {
  const spy = useSelector(selectSpy);
  const Phase = useGameRenderer();
  useGameStartSync();
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {spy && <RoleInfo />}
        <Phase />
      </Box>
    </Container>
  );
}
