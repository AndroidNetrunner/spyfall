import { Box } from '@mui/material';

export default function PlayersWhoDidNotVote({ unvotedOpponents }: { unvotedOpponents: string }) {
  return <Box sx={{ mt: 3 }}>미투표 플레이어: {unvotedOpponents}</Box>;
}
