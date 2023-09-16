import { selectVotes } from '@/redux/slices/questionPhaseSlice';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useSnackbarState = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [openedSnackbar, setOpenedSnackbar] = useState(false);
  const [isinitialRender, setIsInitialRender] = useState(true);
  const votes = useSelector(selectVotes);

  useEffect(() => {
    if (isinitialRender) {
      setIsInitialRender(false);
      return;
    }
    if (!votes) setOpenedSnackbar(true);
  }, [votes]);

  return [openedSnackbar, setOpenedSnackbar];
};

export default useSnackbarState;
