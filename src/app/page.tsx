'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, ref } from 'firebase/database';

import Entrance from './Entrance/Entrance';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';

import { enterRoomByInvitationCode, selectUser, setUserId } from '../redux/slices/userSlice';
import { selectInvitationCode } from '@/redux/slices/roomSlice';
// 1. 👇 `selectPlace`를 gameSlice에서 import 합니다.
import { selectPlace } from '@/redux/slices/gameSlice';

import db from '../../firebase/firebase.config';
import { LOCAL_STORAGE_ID, LOCAL_STORAGE_INVITATION_CODE } from '@/constants/localStorage';
import { UserId } from '@/types/UserId';
import { InvitationCode } from '@/types/InvitationCode';

export default function Home() {
  const dispatch = useDispatch();
  const id = useSelector(selectUser).id;
  const invitationCode = useSelector(selectInvitationCode);
  // 2. 👇 `place` 상태를 Redux 스토어에서 가져옵니다.
  const place = useSelector(selectPlace);

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

  // 3. 👇 여기가 핵심적인 렌더링 로직 수정 부분입니다.
  if (id) {
    // 게임 데이터 (`place`)가 존재하면 Game 컴포넌트를 보여줍니다.
    if (place) {
      return <Game />;
    }
    // 게임 데이터는 없지만 초대 코드 (`invitationCode`)가 있으면 Lobby를 보여줍니다.
    if (invitationCode) {
      return <Lobby />;
    }
  }
  
  // 위 조건에 모두 해당하지 않으면 Entrance를 보여줍니다.
  return <Entrance />;
}