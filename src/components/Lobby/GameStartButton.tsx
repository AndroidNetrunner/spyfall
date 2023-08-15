import useCreateHandler from '@/hooks/useCreateHandler';
import { selectInvitationCode, selectPlayers } from '@/redux/slices/roomSlice';
import { UserState } from '@/redux/slices/userSlice';
import { Alert, Box, Button } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

export default function GameStartButton() {
  const players = useSelector(selectPlayers);
  const invitationCode = useSelector(selectInvitationCode);
  const { handleStart } = useCreateHandler();
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음.');
  return (
    <>
      {!isAbleToStartGame(players) && <Alert severity="error">최소 3명의 인원이 있어야 게임 시작이 가능합니다.</Alert>}
      <Box>
        <Button
          sx={{ mt: 3 }}
          variant="outlined"
          disabled={(() => !isAbleToStartGame(players))()}
          onClick={() => void handleStart(invitationCode, players)}>
          게임 시작
        </Button>
      </Box>
    </>
  );
}

function isAbleToStartGame(players: UserState[]): boolean {
  return players.length >= 3 && players.length <= 8;
}