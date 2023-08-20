import { Container } from '@mui/material';
import useGameStartSync from '@/hooks/useGameStartSync';
import GameContent from './GameContent';

export default function Game() {
  useGameStartSync();
  return (
    <Container component="main" maxWidth="xs">
      <GameContent />
    </Container>
  );
}
