import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ref, onValue, get, update, Query } from 'firebase/database';
import { UserState } from '@/redux/slices/userSlice';
import { selectPlayers, setInvitationCode, setPlayers, setPlayers as setRoomPlayers } from '@/redux/slices/roomSlice';
import { InvitationCode } from '@/types/InvitationCode';
import db from '../../firebase/firebase.config';
import isSamePlayersWithFirebaseStore from '@/utils/isSamePlayersWithFirebaseStore';
import { RoomData } from '@/types/Data';
import Players from '@/types/Players';

function usePlayersUpdate(roomRef: Query) {
  const dispatch = useDispatch();
  const players = useSelector(selectPlayers);

  useEffect(() => {
    const unsubscribe = onValue(roomRef, snapshot => {
      const currentData = snapshot.val() as RoomData;
      if (currentData) {
        if (
          typeof currentData === 'object' &&
          'players' in currentData &&
          !isSamePlayersWithFirebaseStore(currentData, players)
        )
          dispatch(setRoomPlayers(currentData.players as Players));
      } else {
        dispatch(setInvitationCode(null));
        dispatch(setPlayers({}));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const deletePlayer = async (userId: string, invitationCode: InvitationCode) => {
    const roomRef = ref(db, 'rooms/' + invitationCode);
    const roomSnap = await get(roomRef);
    const currentData = roomSnap.val() as RoomData;
    if (currentData && currentData.players) {
      const updatedPlayers = Object.values(currentData.players).filter((player: UserState) => player.id !== userId);
      await update(roomRef, { players: updatedPlayers });
    }
  };

  return { deletePlayer };
}

export default usePlayersUpdate;
