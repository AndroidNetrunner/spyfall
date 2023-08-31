import React, { useEffect } from 'react';
import PlayerWaitList from './PlayerWaitList';
import { Box, Container } from '@mui/material';
import GameStartButton from './GameStartButton';
import { useSelector } from 'react-redux';
import { selectInvitationCode, selectPlayers } from '@/redux/slices/roomSlice';
import db from '../../../firebase/firebase.config';
import { selectUser } from '@/redux/slices/userSlice';
import InvitationCodeComponent from './InvitationCode';
import usePlayersUpdate from '@/hooks/usePlayersUpdate';
import { ref } from 'firebase/database';

export default function Lobby() {
  const invitationCode = useSelector(selectInvitationCode);
  const players = useSelector(selectPlayers);
  const myUserId = useSelector(selectUser).id;
  if (!invitationCode || !myUserId) throw new Error('초대 코드 혹은 userID가 존재하지 않음');
  const { deletePlayer } = usePlayersUpdate(ref(db, 'rooms/' + invitationCode));

  useEffect(() => {
    window.addEventListener('beforeunload', () => void deletePlayer(myUserId, invitationCode));
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
        <GameStartButton />
        <PlayerWaitList players={players} />
      </Box>
    </Container>
  );
}
