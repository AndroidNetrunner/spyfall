import { Box, Container } from '@mui/material';
import useGameStartSync from '@/hooks/useGameStartSync';
import { useSelector } from 'react-redux';
import { selectSpy } from '@/redux/slices/gameSlice';
import RoleInfo from './RoleInfo/RoleInfo';
import useGameRenderer from '@/hooks/useGameRenderer';
import ForceQuitButton from './ForceQuitButton';

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
        <Box sx={{ alignSelf: 'flex-start' }}>
          {/* 화면의 왼쪽에 ForceQuitButton을 배치하고 싶음. */}
          <ForceQuitButton />
        </Box>
        {spy && <RoleInfo />}
        <Phase />
      </Box>
    </Container>
  );
}
