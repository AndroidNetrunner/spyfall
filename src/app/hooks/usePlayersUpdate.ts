import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { onValue, Query } from 'firebase/database';
import { selectPlayers, setInvitationCode, setPlayers, setPlayers as setRoomPlayers } from '@/redux/slices/roomSlice';
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
}

export default usePlayersUpdate;
