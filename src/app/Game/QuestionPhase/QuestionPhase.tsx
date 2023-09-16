import React, { useCallback, useState } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';

import AccusationButton from './AccusationButton';
import AvailablePlaces from './AvailablePlaces';
import GuessingPlaceForm from './GuessingPlaceForm';
import Timer from './Timer';
import VoteForAccuse from './VoteForAccuse';

import useSnackbarState from '@/app/hooks/useSnackbarState';

import { selectId } from '@/redux/slices/userSlice';
import { selectNominator } from '@/redux/slices/questionPhaseSlice';
import { selectSpy } from '@/redux/slices/gameSlice';

export default function QuestionPhase() {
  const [openedSnackbar, setOpenedSnackbar] = useSnackbarState();

  const handleCloseSnackbar = useCallback(() => {
    setOpenedSnackbar(false);
  }, [setOpenedSnackbar]);

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

  if (nominator) {
    return <VoteForAccuse />;
  }

  const renderAccusationButton = canAccuse && <AccusationButton setCanAccuse={setCanAccuse} />;
  const renderGuessingPlaceForm = spy?.id === myUserId && <GuessingPlaceForm />;

  return (
    <>
      {renderAccusationButton}
      {renderGuessingPlaceForm}
    </>
  );
}
