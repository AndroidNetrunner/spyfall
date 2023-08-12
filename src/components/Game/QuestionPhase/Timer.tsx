import useInterval from '@/hooks/useInterval';
import { selectTimer, setTimer } from '@/redux/slices/questionPhaseSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Timer() {
  const timer = useSelector(selectTimer);
  const dispatch = useDispatch();

  useInterval(() => {
    dispatch(setTimer(timer > 0 ? timer - 1 : 0));
  }, 1000);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div>
      남은 시간: {minutes}분 {seconds}초
    </div>
  );
}
