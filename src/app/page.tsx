'use client';

import Entrance from '../components/Entrance/Entrance';
import Lobby from '../components/Lobby/Lobby';
import { useDispatch, useSelector } from 'react-redux';
import { enterRoomByInvitationCode, selectUser, setUserId } from '../redux/slices/userSlice';
import { selectInvitationCode } from '@/redux/slices/roomSlice';
import Game from '@/components/Game/Game';
import { LOCAL_STORAGE_ID, LOCAL_STORAGE_INVITATION_CODE } from '@/constants/localStorage';
import { UserId } from '@/types/UserId';
import { InvitationCode } from '@/types/InvitationCode';
import { useEffect } from 'react';
import { get, ref } from 'firebase/database';
import db from '../../firebase/firebase.config';

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const storagedId = localStorage.getItem(LOCAL_STORAGE_ID) as UserId | null;
      const storagedInvitationCode = localStorage.getItem(LOCAL_STORAGE_INVITATION_CODE) as InvitationCode | null;

      if (storagedId && storagedInvitationCode) {
        const gameRef = ref(db, 'games/' + storagedInvitationCode);

        const snapshot = await get(gameRef);

        if (snapshot.exists()) {
          dispatch(setUserId(storagedId));
          dispatch(enterRoomByInvitationCode(storagedInvitationCode));
        } else {
          localStorage.removeItem(LOCAL_STORAGE_ID);
          localStorage.removeItem(LOCAL_STORAGE_INVITATION_CODE);
        }
      }
    };
    void fetchData();
  }, []);

  const invitationCode = useSelector(selectInvitationCode);
  const id = useSelector(selectUser).id;
  if (id && !invitationCode) return <Game />;
  return id && invitationCode ? <Lobby /> : <Entrance />;
}
