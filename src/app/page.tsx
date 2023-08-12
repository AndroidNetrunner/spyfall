'use client';

import Entrance from '../components/Entrance/Entrance';
import Lobby from '../components/Lobby/Lobby';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/userSlice';
import { selectInvitationCode } from '@/redux/slices/roomSlice';
import Game from '@/components/Game/Game';

export default function Home() {
  const invitationCode = useSelector(selectInvitationCode);
  const { id } = useSelector(selectUser);
  if (id && !invitationCode) return <Game />;
  return id && invitationCode ? <Lobby /> : <Entrance />;
}
