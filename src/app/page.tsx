'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, ref } from 'firebase/database';

import Entrance from './Entrance/Entrance';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';

import { enterRoomByInvitationCode, selectUser, setUserId } from '../redux/slices/userSlice';
import { selectInvitationCode, setInvitationCode } from '@/redux/slices/roomSlice';

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

  const fetchRoomFromFirebase = async (invitationCode: InvitationCode) => {
    const roomRef = ref(db, 'rooms/' + invitationCode);
    const snapshot = await get(roomRef);
    return snapshot.exists();
  };

  const handleStateRestoration = (
    gameExists: boolean,
    roomExists: boolean,
    storagedId: UserId,
    storagedInvitationCode: InvitationCode,
  ) => {
    dispatch(setUserId(storagedId));
    if (gameExists) {
      // 게임 진행 중 상태 복원
      dispatch(enterRoomByInvitationCode(storagedInvitationCode));
      dispatch(setInvitationCode(null)); // 게임 상태에서는 room 코드를 null로 설정
    } else if (roomExists) {
      // 로비 상태 복원
      dispatch(setInvitationCode(storagedInvitationCode));
    } else {
      // 유효하지 않은 상태 (게임도 방도 없음)
      localStorage.removeItem(LOCAL_STORAGE_ID);
      localStorage.removeItem(LOCAL_STORAGE_INVITATION_CODE);
      dispatch(setUserId(null)); // 유저 상태도 초기화
    }
  };

  const fetchData = async () => {
    const { storagedId, storagedInvitationCode } = getLocalStorageData();

    if (storagedId && storagedInvitationCode) {
      const gameExists = await fetchGameFromFirebase(storagedInvitationCode);
      const roomExists = await fetchRoomFromFirebase(storagedInvitationCode);
      handleStateRestoration(gameExists, roomExists, storagedId, storagedInvitationCode);
    }
  };

  if (id) {
    if (!invitationCode) return <Game />;
    return <Lobby />;
  }
  return <Entrance />;
}
