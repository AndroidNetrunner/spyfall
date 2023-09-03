import { Alert, Box, Snackbar } from '@mui/material';
import Timer from './Timer';
import AccusationButton from './AccusationButton';
import { useSelector } from 'react-redux';
import { selectNominator } from '@/redux/slices/questionPhaseSlice';
import VoteForAccuse from './VoteForAccuse';
import { selectSpy } from '@/redux/slices/gameSlice';
import { selectId } from '@/redux/slices/userSlice';
import GuessingPlaceForm from './GuessingPlaceForm';
import AvailablePlaces from './AvailablePlaces';
import { useCallback, useState } from 'react';
import useSnackbarState from '@/hooks/useSnackbarState';

export default function QuestionPhase() {
  const [openedSnackbar, setOpenedSnackbar] = useSnackbarState();
  const handleCloseSnackbar = useCallback(() => {
    setOpenedSnackbar(false);
  }, []);

  return (
    <Box>
      <Timer />
      <PlayerActionPanel />
      <AvailablePlaces />
      <Snackbar open={openedSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity="warning">투표가 부결되었습니다.</Alert>
      </Snackbar>
    </Box>
  );
}

function PlayerActionPanel() {
  const nominator = useSelector(selectNominator);
  const spy = useSelector(selectSpy);
  const myUserId = useSelector(selectId);
  const [canAccuse, setCanAccuse] = useState(true);
  if (nominator) return <VoteForAccuse />;

  return (
    <>
      {canAccuse && <AccusationButton setCanAccuse={setCanAccuse} />}
      {spy?.id === myUserId && <GuessingPlaceForm />}
    </>
  );
}
