import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { doc, onSnapshot, getDoc, updateDoc, DocumentData, DocumentReference } from 'firebase/firestore';
import { UserState } from '@/redux/slices/userSlice';
import { selectPlayers, setInvitationCode, setPlayers } from '@/redux/slices/roomSlice';
import { InvitationCode } from '@/types/isValidInvitationCode';
import db from '../../firebase/firebase.config';
import isSamePlayersWithFirebaseStore from '@/utils/isSamePlayersWithFirebaseStore';

function usePlayersUpdate(docRef: DocumentReference<DocumentData>) {
    const dispatch = useDispatch();
  const players = useSelector(selectPlayers);    
  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const currentData = snapshot.data();
        if (
          typeof currentData === "object" &&
          "players" in currentData &&
          !isSamePlayersWithFirebaseStore(currentData.players as UserState[], players)
        )
          dispatch(setPlayers(currentData.players as UserState[]));
      } else {
        dispatch(setInvitationCode(null));
        dispatch(setPlayers([]));
      }
    });

    return () => {
      unsubscribe();

    };
  }, [docRef.path]);

  const deletePlayer = async (userId: string, invitationCode: InvitationCode) => {
    const docRef = doc(db, 'rooms', invitationCode);
    const data = await getDoc(docRef);
    if (data.exists()) {
      const players = data.data().players as UserState[];
      await updateDoc(docRef, {
        players: players.filter((player: UserState) => player.id !== userId),
      });
    }
  };

  return { deletePlayer };
}

export default usePlayersUpdate;