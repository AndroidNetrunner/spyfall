'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, ref } from 'firebase/database';

import Entrance from './Entrance/Entrance';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';

import { enterRoomByInvitationCode, selectUser, setUserId } from '../redux/slices/userSlice';
import { selectInvitationCode } from '@/redux/slices/roomSlice';

import db from '../../firebase/firebase.config';
import { LOCAL_STORAGE_ID, LOCAL_STORAGE_INVITATION_CODE } from '@/constants/localStorage';
import { UserId } from '@/types/UserId';
import { InvitationCode } from '@/types/InvitationCode';

export default function Home() {
  const dispatch = useDispatch();
  const invitationCode = useSelector(selectInvitationCode);
  const id = useSelector(selectUser).id;

  useEffect(() => {
    void fetchData();
  }, []);

  const getLocalStorageData = () => {
    const storagedId = localStorage.getItem(LOCAL_STORAGE_ID) as UserId | null;
    const storagedInvitationCode = localStorage.getItem(LOCAL_STORAGE_INVITATION_CODE) as InvitationCode | null;

    return { storagedId, storagedInvitationCode };
  };

  const fetchGameFromFirebase = async (invitationCode: InvitationCode) => {
    const gameRef = ref(db, 'games/' + invitationCode);
    const snapshot = await get(gameRef);

    return snapshot.exists();
  };

  const handleGameData = (exists: boolean, storagedId: UserId, storagedInvitationCode: InvitationCode) => {
    if (exists) {
      dispatch(setUserId(storagedId));
      dispatch(enterRoomByInvitationCode(storagedInvitationCode));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ID);
      localStorage.removeItem(LOCAL_STORAGE_INVITATION_CODE);
    }
  };

  const fetchData = async () => {
    const { storagedId, storagedInvitationCode } = getLocalStorageData();

    if (storagedId && storagedInvitationCode) {
      const exists = await fetchGameFromFirebase(storagedInvitationCode);
      handleGameData(exists, storagedId, storagedInvitationCode);
    }
  };

  if (id) {
    if (!invitationCode) return <Game />;
    return <Lobby />;
  }
  return <Entrance />;
}
