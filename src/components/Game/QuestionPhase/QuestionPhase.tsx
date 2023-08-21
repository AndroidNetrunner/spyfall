import { Alert, Box, Snackbar } from '@mui/material';
import Timer from './Timer';
import AccusationButton from './AccusationButton';
import { useSelector } from 'react-redux';
import { selectNominator } from '@/redux/slices/questionPhaseSlice';
import VoteForAccuse from './VoteForAccuse';
import { selectSpy } from '@/redux/slices/gameSlice';
import { selectId } from '@/redux/slices/userSlice';
import GuessingPlaceButton from './GuessingPlaceButton';
import AvailablePlaces from './AvailablePlaces';
import { useState } from 'react';
import useSnackbarState from '@/hooks/useSnackbarState';

export default function QuestionPhase() {
  const [openedSnackbar, setOpenedSnackbar] = useSnackbarState();

  return (
    <Box>
      <PlayerAction />
      <Timer />
      <AvailablePlaces />
      <Snackbar open={openedSnackbar} autoHideDuration={6000} onClose={() => setOpenedSnackbar(false)}>
        <Alert severity="warning">투표가 부결되었습니다.</Alert>
      </Snackbar>
    </Box>
  );
}

function PlayerAction() {
  const nominator = useSelector(selectNominator);
  const spy = useSelector(selectSpy);
  const myUserId = useSelector(selectId);
  const [canAccuse, setCanAccuse] = useState(true);
  if (nominator) return <VoteForAccuse />;

  return (
    <>
      {canAccuse && <AccusationButton setCanAccuse={setCanAccuse} />}
      {spy?.id === myUserId && <GuessingPlaceButton />}
    </>
  );
}
