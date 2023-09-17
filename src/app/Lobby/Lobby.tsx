import React, { useEffect } from 'react';
import PlayerWaitList from './PlayerWaitList';
import { Box, Container, Typography } from '@mui/material';
import GameStartButton from './GameStartButton';
import { useSelector } from 'react-redux';
import { selectInvitationCode, selectIsGameMaster, selectPlayers } from '@/redux/slices/roomSlice';
import db from '../../../firebase/firebase.config';
import { selectUser } from '@/redux/slices/userSlice';
import InvitationCodeComponent from './InvitationCode';
import usePlayersUpdate from '@/app/hooks/usePlayersUpdate';
import { onDisconnect, ref } from 'firebase/database';
import { waitingDescriptionStyle } from './Lobby.styles';

export default function Lobby() {
  const invitationCode = useSelector(selectInvitationCode);
  const players = useSelector(selectPlayers);
  const myUserId = useSelector(selectUser).id;
  const isGameMaster = useSelector(selectIsGameMaster);
  if (!invitationCode || !myUserId) throw new Error('초대 코드 혹은 userID가 존재하지 않음');
  usePlayersUpdate(ref(db, 'rooms/' + invitationCode));
  useEffect(() => {
    const userRef = ref(db, 'rooms/' + invitationCode + '/players/' + myUserId);
    void onDisconnect(userRef).remove();
  }, []);
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
        <InvitationCodeComponent invitationCode={invitationCode} />
        {isGameMaster ? (
          <GameStartButton />
        ) : (
          <Typography sx={waitingDescriptionStyle}>방장의 게임 시작 대기중...</Typography>
        )}
        <PlayerWaitList players={players} />
      </Box>
    </Container>
  );
}
