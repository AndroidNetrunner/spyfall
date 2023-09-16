import useInterval from '@/hooks/useInterval';
import { selectTimer, selectVotes, setTimer } from '@/redux/slices/questionPhaseSlice';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// TODO: 고발 발생 시 타이머 멈추도록 설정

export default function Timer() {
  const timer = useSelector(selectTimer);
  const votes = useSelector(selectVotes);
  const dispatch = useDispatch();

  useInterval(() => {
    if (!votes) dispatch(setTimer(timer > 0 ? timer - 1 : 0));
  }, 1000);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <Box sx={{ color: votes ? 'gray' : 'white' }} display="flex" justifyContent="center">
      남은 시간: {minutes}분 {seconds}초
    </Box>
  );
}
