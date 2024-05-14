import useInterval from '@/app/hooks/useInterval';
import { LOCAL_STORAGE_END_TIME } from '@/constants/localStorage';
import { selectTimer, selectVotes, setTimer } from '@/redux/slices/questionPhaseSlice';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Timer() {
  const timer = useSelector(selectTimer);
  const votes = useSelector(selectVotes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE_END_TIME)) {
      const gameEndTime = Date.now() + 8 * 60 * 1000;
      localStorage.setItem(LOCAL_STORAGE_END_TIME, gameEndTime.toString());
    }
    const currentEndTime = localStorage.getItem(LOCAL_STORAGE_END_TIME);
    if (!currentEndTime) return;
    dispatch(setTimer((parseInt(currentEndTime, 10) - Date.now()) / 1000));
  }, []);

  useInterval(() => {
    if (!votes) dispatch(setTimer(timer > 0 ? timer - 1 : 0));
  }, 1000);

  const minutes = Math.floor(timer / 60);
  const seconds = Math.floor(timer % 60);

  return (
    <Box sx={{ color: votes ? 'gray' : 'white' }} display="flex" justifyContent="center">
      남은 시간: {minutes}분 {seconds}초
    </Box>
  );
}
