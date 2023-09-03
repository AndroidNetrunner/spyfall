import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, onValue, remove } from 'firebase/database';

import db from '../../firebase/firebase.config';
import { selectUser } from '@/redux/slices/userSlice';
import { resetGame, setGame, setResultDescription } from '@/redux/slices/gameSlice';
import { setFinalVotes } from '@/redux/slices/votePhaseSlice';
import { resetQuestionPhase, setNominator, setNominee, setTimer, setVotes } from '@/redux/slices/questionPhaseSlice';
import isGameData from '@/validators/isGameData';
import GameData from '@/types/GameData';

export default function useGameStartSync() {
  const { invitationCode } = useSelector(selectUser);
  const [isGameStarted, setGameStarted] = useState(false);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');

  const gameRef = ref(db, 'games/' + invitationCode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTimer(5));
    console.log(`useEffect activated!`);
    const unsubscribe = onValue(gameRef, snapshot => {
      const currentData = snapshot.val() as GameData;
      if (isGameData(currentData)) {
        if (!isGameStarted) {
          dispatch(setGame(currentData));
          setGameStarted(true);
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
      void remove(gameRef);
      dispatch(resetGame());
      dispatch(resetQuestionPhase());
    };
  }, []);
}
