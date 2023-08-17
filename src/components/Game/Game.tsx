import { Box, Container } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import db from '../../../firebase/firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { GameState, selectResultDescription, selectSpy, setGame, setResultDescription } from '@/redux/slices/gameSlice';
import { selectUser } from '@/redux/slices/userSlice';
import RoleInfo from './RoleInfo';
import QuestionPhase from './QuestionPhase/QuestionPhase';
import VotePhase from './VotePhase';
import { selectTimer, setNominator, setNominee, setTimer, setVotes } from '@/redux/slices/questionPhaseSlice';
import { UserId } from '@/types/isValidUserId';
import { Vote } from '@/types/Vote';
import { setFinalVotes } from '@/redux/slices/votePhaseSlice';
import Result from './Result/Result';

export default function Game() {
  const dispatch = useDispatch();
  const { invitationCode } = useSelector(selectUser);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
  const docRef = doc(db, 'games', invitationCode);
  const spy = useSelector(selectSpy);
  const timer = useSelector(selectTimer);
  const resultDescription = useSelector(selectResultDescription);
  useEffect(() => {
    dispatch(setTimer(8 * 60));
    const unsubscribe = onSnapshot(docRef, snapshot => {
      const currentData = snapshot.data();
      if (typeof currentData === 'object') dispatch(setGame(currentData as GameState));
      if (typeof currentData === 'object' && typeof currentData.votes === 'object') {
        dispatch(setVotes(currentData.votes as Vote));
        dispatch(setNominee(currentData.nominee as UserId | null));
        dispatch(setNominator(currentData.nominator as UserId | null));
      }
      if (typeof currentData === 'object' && typeof currentData.finalVotes === 'object') {
        dispatch(
          setFinalVotes(
            currentData.finalVotes as {
              [key in UserId]: UserId | null;
            },
          ),
        );
      }
      if (typeof currentData === 'object' && currentData.resultDescription)
        dispatch(setResultDescription(currentData.resultDescription as string));
    });

    return () => {
      unsubscribe();
    };
  }, [docRef.path]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {resultDescription ? (
          <Result />
        ) : (
          <>
            {spy && <RoleInfo />}
            {timer > 0 ? <QuestionPhase /> : <VotePhase />}
          </>
        )}
      </Box>
    </Container>
  );
}
