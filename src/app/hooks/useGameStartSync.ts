import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, onValue } from 'firebase/database';

import db from '../../../firebase/firebase.config';
import { selectUser } from '@/redux/slices/userSlice';
import { resetGame, setGame, setResultDescription, selectInvitationCode as selectGameInvitationCode } from '@/redux/slices/gameSlice';
import { setFinalVotes } from '@/redux/slices/votePhaseSlice';
import { resetQuestionPhase, setNominator, setNominee, setVotes } from '@/redux/slices/questionPhaseSlice';
import isGameData from '@/validators/isGameData';
import GameData from '@/types/GameData';
import { LOCAL_STORAGE_ID, LOCAL_STORAGE_INVITATION_CODE } from '@/constants/localStorage';

export default function useGameStartSync() {
  const { invitationCode, id } = useSelector(selectUser);
  const gameInvitationCode = useSelector(selectGameInvitationCode);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
  if (!id) throw new Error('유저 id가 존재하지 않음');

  const gameRef = ref(db, 'games/' + invitationCode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== undefined) {
      localStorage.setItem(LOCAL_STORAGE_ID, id);
      localStorage.setItem(LOCAL_STORAGE_INVITATION_CODE, invitationCode);
    }
    const unsubscribe = onValue(gameRef, snapshot => {
      const currentData = snapshot.val() as GameData;
      if (isGameData(currentData)) {
        if (!gameInvitationCode) {
          dispatch(setGame(currentData));
        }
        dispatch(setVotes(currentData.votes));
        dispatch(setNominee(currentData.nominee));
        dispatch(setNominator(currentData.nominator));
        if (currentData.finalVotes) dispatch(setFinalVotes(currentData.finalVotes));
        dispatch(setResultDescription(currentData.resultDescription));
      }
    });

    return () => {
      unsubscribe();
      // void remove(gameRef);
      dispatch(resetGame());
      dispatch(resetQuestionPhase());
    };
  }, [gameInvitationCode]);
}
