import { Alert, Box, Snackbar } from '@mui/material';
import Timer from './Timer';
import AccusationButton from './AccusationButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectNominator, selectVotes, setTimer } from '@/redux/slices/questionPhaseSlice';
import VoteForAccuse from './VoteForAccuse';
import { selectSpy } from '@/redux/slices/gameSlice';
import { selectId } from '@/redux/slices/userSlice';
import GuessingPlaceButton from './GuessingPlaceButton';
import AvailablePlaces from './AvailablePlaces';
import { useEffect, useState } from 'react';

export default function QuestionPhase() {
  const nominator = useSelector(selectNominator);
  const spy = useSelector(selectSpy);
  const myUserId = useSelector(selectId);
  const dispatch = useDispatch();
  const [openedSnackbar, setOpenedSnackbar] = useState(false);
  const [canAccuse, setCanAccuse] = useState(true);
  const votes = useSelector(selectVotes);
  useEffect(() => {
    dispatch(setTimer(8 * 60));
  }, []);
  useEffect(() => {
    const readVotes = Object.values(votes);
    if (readVotes.every(vote => vote !== null) && readVotes.some(vote => vote === false)) setOpenedSnackbar(true);
  }, [votes]);
  return (
    <Box>
      {nominator ? (
        <VoteForAccuse />
      ) : (
        <>
          {canAccuse && <AccusationButton setCanAccuse={setCanAccuse} />}
          <Timer />
        </>
      )}
      {spy?.id === myUserId && <GuessingPlaceButton />}
      <AvailablePlaces />
      <Snackbar open={openedSnackbar} autoHideDuration={6000} onClose={() => setOpenedSnackbar(false)}>
        <Alert severity="warning">투표가 부결되었습니다.</Alert>
      </Snackbar>
    </Box>
  );
}